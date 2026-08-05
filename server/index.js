const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Ensure upload directories exist
const uploadImagesDir = path.join(__dirname, 'public', 'uploads', 'images');
if (!fs.existsSync(uploadImagesDir)) {
  fs.mkdirSync(uploadImagesDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadImagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

dotenv.config();

const app = express();

const templateDirName = process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'templates_dist')) 
  ? 'templates_dist' 
  : 'templates';
const prisma = new PrismaClient({
  log: ['error'],
});

// ============================================================
// GLOBAL ERROR HANDLERS — Prevent server crash on unhandled errors
// ============================================================
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.message, err.stack);
  // Don't exit — keep server alive
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit — keep server alive
});

app.use(cors());
app.use(express.json());

// ============================================================
// SOURCE CODE PROTECTION
// ============================================================
const PROTECTION_SCRIPT = [
  '<script>',
  '(function(){',
  "  'use strict';",
  "  document.addEventListener('contextmenu',function(e){e.preventDefault();return false;},true);",
  "  document.addEventListener('keydown',function(e){",
  "    if(e.key==='F12'||(e.ctrlKey&&['u','s','p'].includes(e.key.toLowerCase()))||(e.ctrlKey&&e.shiftKey&&['i','j','c','k'].includes(e.key.toLowerCase()))){",
  "      e.preventDefault();e.stopPropagation();return false;",
  "    }",
  "  },true);",
  "  document.addEventListener('selectstart',function(e){e.preventDefault();},true);",
  "  document.addEventListener('dragstart',function(e){e.preventDefault();},true);",
  "  console.log('%c\uD83D\uDD12 Only Love Gift','color:#ff6b9d;font-size:22px;font-weight:bold;');",
  "  console.log('%cNoi dung nay duoc bao ve boi Only Love Gift.','color:#aaa;font-size:12px;');",
  '})();',
  '</script>',
].join('\n');

function injectProtection(html) {
  if (html.includes('</head>')) {
    return html.replace('</head>', PROTECTION_SCRIPT + '\n</head>');
  }
  return PROTECTION_SCRIPT + html;
}

// Routes
// ----------------------------------------------------
// DYNAMIC GIFT TEMPLATES (must be before static files)
// ----------------------------------------------------
app.get('/gift/render/:code', async (req, res) => {
  try {
    const code = req.params.code || req.query.code;
    if (!code) return res.status(400).send('Thiếu mã đơn hàng');
    
    const order = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!order || order.status !== 'SUCCESS') {
      return res.status(404).send('Không tìm thấy món quà hoặc đơn hàng chưa thanh toán hoàn tất.');
    }

    const templateId = order.templateId;
    const htmlPath = path.join(__dirname, templateDirName, templateId, 'index.html');
    
    if (!fs.existsSync(htmlPath)) {
      return res.status(404).send('Giao diện quà tặng không tồn tại.');
    }

    let html = fs.readFileSync(htmlPath, 'utf8');

    let messageData = order.message;
    let passcode = null;
    let extraData = {};
    try {
      if (order.message && order.message.trim().startsWith('{')) {
        const parsed = JSON.parse(order.message);
        if (parsed.text !== undefined) messageData = parsed.text;
        passcode = parsed.passcode;
        extraData = parsed;
      }
    } catch(e) {}

    // Create the dynamic data
    const dynamicData = {
      recipientName: order.receiverName,
      senderName: order.senderName || "Người Giấu Tên",
      birthday: order.birthday,
      messages: messageData ? messageData.split('\n').filter(msg => msg.trim() !== '') : [],
      passcode: passcode,
      images: order.images ? JSON.parse(order.images) : [],
      music: order.musicUrl || "",
      ...extraData
    };

    const dataScript = `<script>window.DYNAMIC_DATA = ${JSON.stringify(dynamicData)}; window.ASSET_BASE_PATH = "/templates/${templateId}/";</script>`;
    
    // Inject dynamic data into the head
    html = html.replace('</head>', `\n${dataScript}\n</head>`);

    // Phục vụ assets relative path
    // Template needs to load assets from /templates/template-name/
    html = html.replace(/src="\.\//g, `src="/templates/${templateId}/`);
    html = html.replace(/href="\.\//g, `href="/templates/${templateId}/`);

    html = injectProtection(html);
    res.send(html);
  } catch (err) {
    console.error('Error generating gift:', err);
    res.status(500).send('Lỗi máy chủ khi tạo quà tặng');
  }
});

// Serve the assets of the template
app.use('/gift/lucky-chance', express.static(path.join(__dirname, 'public', 'templates', 'lucky-chance')));

// Serve deployed static sites (Old deploy method, keeping for safety if any exist)
app.use('/deploy', express.static(path.join(__dirname, 'public', 'deploy')));

// Serve raw template assets for dynamic rendering
app.use('/templates', express.static(path.join(__dirname, templateDirName)));

// ----------------------------------------------------
// DYNAMIC RENDER ROUTE (On-The-Fly Generation)
// ----------------------------------------------------
app.get('/gift/view/:code', async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).send('Thiếu mã đơn hàng');
    
    const order = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!order || order.status !== 'SUCCESS') {
      return res.status(404).send('Không tìm thấy món quà hoặc đơn hàng chưa thanh toán hoàn tất.');
    }

    const templateId = order.templateId;
    const htmlPath = path.join(__dirname, templateDirName, templateId, 'index.html');
    
    if (!fs.existsSync(htmlPath)) {
      return res.status(404).send('Giao diện quà tặng đang được bảo trì.');
    }

    let html = fs.readFileSync(htmlPath, 'utf8');

    // Replace placeholders with real order data
    html = html.replace(/\{\{RECEIVER_NAME\}\}/g, order.receiverName || 'Người Thương');
    html = html.replace(/\{\{SENDER_NAME\}\}/g, order.senderName || 'Người Ẩn Danh');
    html = html.replace(/\{\{MESSAGE\}\}/g, (order.message || 'Chúc mừng sinh nhật, tuổi mới luôn ngập tràn niềm vui và hạnh phúc nhé! 🎂❤').replace(/\n/g, '<br>'));
    
    // Inject Birthday into the 3D text array
    if (order.birthday && order.birthday.trim() !== '') {
      html = html.replace(/\{\{BIRTHDAY\}\}/g, order.birthday.trim());
    } else {
      // Remove the {{BIRTHDAY}} array element entirely if not provided
      html = html.replace(/,\s*"\{\{BIRTHDAY\}\}"/g, '');
    }
    
    // Inject musicUrl if provided
    if (order.musicUrl && order.musicUrl.trim() !== '') {
      html = html.replace(
        /music:\s*["'].*?["']/,
        `music: "${order.musicUrl.trim()}"`
      );
    }

    if (order.images) {
      try {
        const imagesArr = JSON.parse(order.images);
        if (imagesArr && imagesArr.length > 0) {
          // Replace the image array inside the template settings
          html = html.replace(
            /image:\s*\[[\s\S]*?\],/,
            `image: ${JSON.stringify(imagesArr)},`
          );
        }
      } catch (e) {
        console.error("Error parsing order images", e);
      }
    }

    html = injectProtection(html);
    res.send(html);
  } catch (err) {
    console.error('Error generating gift:', err);
    res.status(500).send('Lỗi máy chủ khi tạo quà tặng');
  }
});

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Dashboard History API
app.get('/api/user/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    const transactions = await prisma.transaction.findMany({
      where: { 
        userId,
        status: { not: 'PENDING' }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, orders, transactions });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy dữ liệu' });
  }
});

// Leaderboard VIP API (Public)
app.get('/api/leaderboard', async (req, res) => {
  const fakeLeaderboard = [
    { name: 'leminhtri3654', totalDeposited: 350000 },
    { name: 'Emi Sadgirl', totalDeposited: 274000, avatar: '/images/avt1.jpg' },
    { name: 'mewmew', totalDeposited: 166666, avatar: '/images/avt2.jpg' },
    { name: 'Nam Nguyen Anh', totalDeposited: 100000 },
    { name: 'Ngọc Trân', totalDeposited: 60000, avatar: '/images/avt3.jpg' },
  ];

  try {
    const realDeposits = await prisma.transaction.groupBy({
      by: ['userId'],
      where: { type: 'DEPOSIT', status: 'SUCCESS' },
      _sum: { amount: true },
    });

    const userIds = realDeposits.map(d => d.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true }
    });

    const realLeaderboard = realDeposits.map(d => {
      const user = users.find(u => u.id === d.userId);
      return {
        name: user ? user.name : 'Ẩn danh',
        totalDeposited: d._sum.amount || 0
      };
    });

    const combined = [...realLeaderboard, ...fakeLeaderboard];
    // Sort descending
    combined.sort((a, b) => b.totalDeposited - a.totalDeposited);

    // Get top 5 unique by name (in case a fake name matches a real name, but it's fine)
    const top5 = combined.slice(0, 5);

    res.json({ success: true, leaderboard: top5 });
  } catch (error) {
    console.error('Leaderboard error:', error.message || error);
    // Graceful fallback: If DB is unreachable (e.g. TiDB sleeps), return the fake leaderboard anyway
    fakeLeaderboard.sort((a, b) => b.totalDeposited - a.totalDeposited);
    res.json({ success: true, leaderboard: fakeLeaderboard });
  }
});

const walletRoutes = require('./routes/wallet');
app.use('/api/wallet', walletRoutes);

// Template stats API (Public)
app.get('/api/templates/stats', async (req, res) => {
  try {
    const stats = await prisma.order.groupBy({
      by: ['templateId'],
      _count: {
        templateId: true
      },
      where: {
        status: 'SUCCESS'
      }
    });
    
    // Convert to simple object { "love-box-01": 5 }
    const formattedStats = {};
    stats.forEach(s => {
      formattedStats[s.templateId] = s._count.templateId;
    });
    
    res.json({ success: true, stats: formattedStats });
  } catch (error) {
    console.error('Template stats error:', error);
    res.json({ success: true, stats: {} });
  }
});

// Lightweight Ping Route for UptimeRobot / CronJob (Giữ server luôn thức)
app.get('/ping', async (req, res) => {
  try {
    // Kiểm tra kết nối DB để đảm bảo Prisma vẫn sống
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', db: 'connected', ts: Date.now() });
  } catch (dbErr) {
    console.error('[PING] DB check failed:', dbErr.message);
    // Vẫn trả 200 để cron-job không báo lỗi, nhưng log DB lỗi
    res.status(200).json({ status: 'ok', db: 'error', error: dbErr.message, ts: Date.now() });
  }
});

// Demo Route (Public - Deprecated for embedded usage)
app.get('/demo/:templateId', (req, res) => {
  const templateId = req.params.templateId;
  const htmlPath = path.join(__dirname, templateDirName, templateId, 'index.html');
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Inject dynamic data for demo
    const dynamicData = {
      recipientName: "Chu Vận",
      senderName: "Người Giấu Tên",
      birthday: "01/01/2000",
      messages: [],
      images: [],
      music: ""
    };
    const dataScript = `<script>window.DYNAMIC_DATA = ${JSON.stringify(dynamicData)}; window.ASSET_BASE_PATH = "/templates/${templateId}/";</script>`;
    html = html.replace('</head>', `\n${dataScript}\n</head>`);
    
    // Phục vụ assets relative path
    html = html.replace(/src="\.\//g, `src="/templates/${templateId}/`);
    html = html.replace(/href="\.\//g, `href="/templates/${templateId}/`);
    
    html = injectProtection(html);
    res.send(html);
  } else {
    res.status(404).send('Demo không tồn tại');
  }
});

// Secure Demo Routes with Anti-Bot Protection
const crypto = require('crypto');
const demoTokens = new Map();
const rateLimitMap = new Map(); // Simple rate limiting for IPs

// Clean up maps periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of demoTokens.entries()) {
    if (value.expiresAt < now) demoTokens.delete(key);
  }
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.timestamp > 60000) rateLimitMap.delete(ip); // clear after 1 minute
  }
}, 60000);

app.post('/api/demo/token', (req, res) => {
  // 1. Check Origin/Referer (Anti-CURL / Anti-Postman)
  const origin = req.headers.origin || req.headers.referer || '';
  if (process.env.NODE_ENV === 'production' && !origin.includes('onlylovegift.vercel.app')) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid Origin' });
  }

  // 2. Rate Limiting — chỉ áp dụng trên production, dev không giới hạn
  if (process.env.NODE_ENV === 'production') {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    const rlData = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    if (now - rlData.timestamp < 60000) {
      if (rlData.count > 60) { // Max 60 demo previews per minute per IP (production)
        return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again later.' });
      }
      rlData.count += 1;
    } else {
      rlData.count = 1;
      rlData.timestamp = now;
    }
    rateLimitMap.set(ip, rlData);
  }

  const { templateId } = req.body;
  if (!templateId) return res.status(400).json({ success: false, message: 'Missing templateId' });
  
  const token = crypto.randomBytes(16).toString('hex');
  // Token tồn tại 5 phút để preview không bị expire khi user đang xem
  demoTokens.set(token, { templateId, expiresAt: Date.now() + 5 * 60 * 1000 });
  
  res.json({ success: true, token });
});

app.get('/demo/secure/:token', (req, res) => {
  // 3. Browser Fetch Metadata check (Anti-Bot / Ensure it's an iframe)
  const fetchDest = req.headers['sec-fetch-dest'];
  if (fetchDest && fetchDest !== 'iframe') {
    return res.status(403).send('<h2>Truy cập bị từ chối.</h2><p>Vui lòng xem trên website chính thức.</p>');
  }

  const token = req.params.token;
  const tokenData = demoTokens.get(token);
  
  if (!tokenData || tokenData.expiresAt < Date.now()) {
    if (tokenData) demoTokens.delete(token); // cleanup
    return res.status(403).send('<h2>Mã xem trước đã hết hạn hoặc không hợp lệ.</h2><p>Vì lý do bảo mật, vui lòng tải lại trang để xem demo mới.</p>');
  }
  
  // Consume token (Single-Use)
  demoTokens.delete(token);
  
  const templateId = tokenData.templateId;
  const htmlPath = path.join(__dirname, templateDirName, templateId, 'index.html');
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Read template's config.json for demo defaults (supports heart-code and similar templates)
    let templateConfig = {};
    const configPath = path.join(__dirname, templateDirName, templateId, 'config.json');
    if (fs.existsSync(configPath)) {
      try { templateConfig = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch(e) {}
    }
    const assetBase = `/templates/${templateId}/`;

    const dynamicData = {
      recipientName: "Chu Vận",
      senderName: "Người Giấu Tên",
      birthday: "01/01/2000",
      messages: templateConfig.copyright ? [templateConfig.copyright] : [],
      images: templateConfig.image ? [assetBase + templateConfig.image] : [],
      music: templateConfig.music ? (assetBase + templateConfig.music) : ""
    };
    const dataScript = `<script>window.DYNAMIC_DATA = ${JSON.stringify(dynamicData)}; window.ASSET_BASE_PATH = "${assetBase}";</script>`;
    html = html.replace('</head>', `\n${dataScript}\n</head>`);

    html = html.replace(/src="\.\/'/g, `src="${assetBase}`);
    html = html.replace(/href="\.\/'/g, `href="${assetBase}`);
    html = html.replace(/src="\.\//g, `src="${assetBase}`);
    html = html.replace(/href="\.\//g, `href="${assetBase}`);

    html = injectProtection(html);
    res.send(html);
  } else {
    res.status(404).send('Demo không tồn tại');
  }
});

// Helper to generate random order code
const generateOrderCode = () => {
  return `GL-${Math.floor(1000 + Math.random() * 9000)}`;
};

// Middleware to verify JWT token
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập đã hết hạn' });
  }
};

// Middleware to verify Admin role
async function requireAdmin(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Quyền truy cập bị từ chối. Chỉ Admin mới được phép.' });
    }
    req.adminUser = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi kiểm tra quyền' });
  }
};

// 1. Create a new order (Requires Login & handles images via ImgBB)
app.post('/api/orders', authenticate, upload.any(), async (req, res) => {
  try {
    const { templateId, senderName, receiverName, birthday, message, musicUrl, passcode } = req.body;
    
    let uploadedImages = [];
    let passImageUrl = null;
    let customMusicUrl = musicUrl || null;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.fieldname === 'images' || file.fieldname === 'passImage') {
          let url = `/uploads/images/${file.filename}`;
          if (process.env.IMGBB_API_KEY) {
            try {
              const formData = new FormData();
              const fileStream = fs.createReadStream(file.path);
              formData.append('image', fileStream);
              const imgbbRes = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData, {
                headers: formData.getHeaders()
              });
              if (imgbbRes.data && imgbbRes.data.success) {
                url = imgbbRes.data.data.url;
              }
            } catch (uploadErr) {
              console.error('ImgBB Upload Error:', uploadErr.response ? uploadErr.response.data : uploadErr.message);
            } finally {
              try { fs.unlinkSync(file.path); } catch (e) {}
            }
          }
          if (file.fieldname === 'passImage') {
            passImageUrl = url;
          } else {
            uploadedImages.push(url);
          }
        } else if (file.fieldname === 'musicFile') {
          customMusicUrl = `/uploads/images/${file.filename}`;
        }
      }
    }

    let finalAmount = 29000; // Đồng giá 29k trong 10 ngày
    
    // Free templates
    if (['merry-christmas', 'christmas'].includes(templateId)) {
        finalAmount = 0;
    }

    let finalMessage = message;
    if (passcode) {
      finalMessage = JSON.stringify({ text: message, passcode });
    }

    const imagesData = passImageUrl ? { gallery: uploadedImages, passImage: passImageUrl } : uploadedImages;
    
    const orderCode = generateOrderCode();
    const isFree = finalAmount === 0;

    const order = await prisma.order.create({
      data: {
        orderCode: orderCode,
        templateId,
        senderName,
        receiverName,
        birthday,
        message: finalMessage || '',
        musicUrl: customMusicUrl,
        amount: finalAmount,
        status: isFree ? 'SUCCESS' : 'PENDING',
        userId: req.user.id,
        deployUrl: isFree ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/gift/view/${orderCode}` : null,
        images: (Array.isArray(imagesData) && imagesData.length > 0) || (!Array.isArray(imagesData)) ? JSON.stringify(imagesData) : null
      }
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// 2. Get order status
app.get('/api/orders/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderCode: code }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// 3. Webhook endpoint (Casso / Sepay will call this)
app.post('/api/webhooks/payment', async (req, res) => {
  let apiKey = req.headers['authorization'] || req.headers['apikey'] || req.headers['x-api-key'] || '';
  // Loại bỏ các tiền tố như "Bearer " hoặc "Apikey " để lấy đúng mã khóa
  apiKey = apiKey.replace(/^(Bearer|Apikey)\s+/i, '').trim();

  // Nếu có cài đặt SEPAY_API_KEY trong môi trường thì bắt buộc phải khớp
  if (process.env.SEPAY_API_KEY) {
    if (apiKey !== process.env.SEPAY_API_KEY) {
      console.warn('Cảnh báo: Có kẻ đang cố gửi Webhook giả mạo!');
      return res.status(401).json({ success: false, message: 'Sai API Key' });
    }
  }

  try {
    // Lấy dữ liệu nội dung CK và số tiền từ payload của SePay
    const content = req.body.content || (req.body.data && req.body.data.content) || '';
    const transferAmount = req.body.transferAmount || (req.body.data && req.body.data.transferAmount) || 0;

    // A. XỬ LÝ NẠP TIỀN VÀO VÍ (NAP-xxxx)
    const napMatch = content.match(/(NAP-\d{4,5})/i);
    if (napMatch) {
      const parsedCode = napMatch[1].toUpperCase();
      
      // Ưu tiên 1: Kiểm tra xem mã này có phải là mã nạp tiền cố định của User nào không
      const userWithCode = await prisma.user.findUnique({ where: { depositCode: parsedCode } });
      
      if (userWithCode) {
        // Cập nhật số dư ví
        await prisma.user.update({
          where: { id: userWithCode.id },
          data: { balance: { increment: Number(transferAmount) } }
        });
        
        // Tự động tạo lịch sử giao dịch SUCCESS
        await prisma.transaction.create({
          data: { 
            userId: userWithCode.id,
            amount: Number(transferAmount),
            type: 'DEPOSIT',
            status: 'SUCCESS',
            txCode: `DEP-${Date.now()}`, // Mã giao dịch hệ thống
            description: 'Nạp tiền tự động'
          }
        });
        return res.json({ success: true, message: 'Deposit successful (Fixed Code)' });
      }

      // Ưu tiên 2 (Tương thích ngược): Tìm giao dịch PENDING cũ nếu có
      const transaction = await prisma.transaction.findUnique({ where: { txCode: parsedCode } });
      
      if (transaction && transaction.status === 'PENDING') {
        await prisma.user.update({
          where: { id: transaction.userId },
          data: { balance: { increment: Number(transferAmount) } }
        });
        
        await prisma.transaction.update({
          where: { txCode: parsedCode },
          data: { 
            status: 'SUCCESS',
            amount: Number(transferAmount)
          }
        });
        return res.json({ success: true, message: 'Deposit successful (Legacy)' });
      }
    }

    // B. XỬ LÝ THANH TOÁN TRỰC TIẾP ĐƠN HÀNG (GL-xxxx)
    // Dùng Regex tìm chữ GL-xxxx trong nội dung (ví dụ: NGUYEN VAN A CHUYEN TIEN GL-1234)
    const match = content.match(/(GL-\d{4})/i);
    
    if (!match) {
      // Nếu không tìm thấy mã đơn hàng, bỏ qua (tiền của người ngoài chuyển)
      return res.json({ success: true, message: 'Ignored: No order/deposit code found in content' });
    }

    const orderCode = match[1].toUpperCase();

    // Tìm đơn hàng trong DB
    const order = await prisma.order.findUnique({ where: { orderCode } });
    
    if (order && order.status === 'PENDING') {
      // Kiểm tra xem khách có chuyển đủ tiền không
      if (Number(transferAmount) >= Number(order.amount)) {
        // Cập nhật trạng thái thành SUCCESS và tạo link truy cập động
        await prisma.order.update({
          where: { orderCode },
          data: { 
            status: 'SUCCESS',
            deployUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/gift/view/${orderCode}`
          }
        });

        return res.json({ success: true, message: 'Order marked as PAID' });
      } else {
        return res.json({ success: true, message: 'Ignored: Transfer amount is less than order amount' });
      }
    }

    res.json({ success: true, message: 'Ignored: Order already paid or not found' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

// 3.5 Pay with Wallet
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success: false });
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'fallback-secret');
    req.userId = decoded.id;
    next();
  } catch (err) { return res.status(401).json({ success: false }); }
};

app.post('/api/orders/:code/pay-with-wallet', authMiddleware, async (req, res) => {
  try {
    const { code } = req.params;
    
    // Tìm đơn hàng
    const order = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!order || order.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Đơn hàng không hợp lệ' });

    // Kiểm tra số dư ví
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (user.balance < order.amount) return res.status(400).json({ success: false, message: 'Số dư không đủ' });

    // Trừ tiền và tạo Transaction (chạy Transaction của Prisma để đảm bảo tính toàn vẹn)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.userId },
        data: { balance: { decrement: order.amount } }
      }),
      prisma.transaction.create({
        data: {
          userId: req.userId,
          amount: order.amount,
          type: 'PAYMENT',
          status: 'SUCCESS',
          txCode: `PAY-${code}-${Date.now()}`,
          description: `Thanh toán đơn hàng ${code}`
        }
      }),
      prisma.order.update({
        where: { orderCode: code },
        data: { status: 'PAID', userId: req.userId }
      })
    ]);

    // Cập nhật SUCCESS và tạo link
    await prisma.order.update({
      where: { orderCode: code },
      data: { 
        status: 'SUCCESS',
        deployUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/gift/view/${code}`
      }
    });

    res.json({ success: true, message: 'Thanh toán bằng ví thành công' });
  } catch (error) {
    console.error('Wallet pay error:', error);
    res.status(500).json({ success: false, message: 'Lỗi thanh toán' });
  }
});

// 4. Mock Pay Endpoint (Admin only - protected for production)
app.post('/api/orders/:code/mock-pay', authenticate, requireAdmin, async (req, res) => {
  try {
    const { code } = req.params;
    const order = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    await prisma.order.update({
      where: { orderCode: code },
      data: { 
        status: 'SUCCESS',
        deployUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/gift/view/${code}`
      }
    });

    res.json({ success: true, message: 'Mock payment initiated' });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
// 5. Feedback endpoints
app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

app.post('/api/feedbacks', authenticate, async (req, res) => {
  try {
    const { rating, message } = req.body;
    
    if (!message || !rating) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user.id,
        name: req.user.name || 'Người Dùng',
        rating: Number(rating),
        message: message,
        status: 'PENDING'
      }
    });

    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi gửi phản hồi' });
  }
});

// 6. Admin Endpoints
app.get('/api/admin/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const os = require('os');
    const usersCount = await prisma.user.count();
    const ordersCount = await prisma.order.count({ where: { status: 'SUCCESS' } });
    
    const revenueObj = await prisma.order.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true }
    });
    const revenue = revenueObj._sum.amount || 0;

    // Calculate directory size for storage
    const getDirSize = async (dirPath) => {
      let size = 0;
      try {
        const files = await fs.promises.readdir(dirPath);
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stats = await fs.promises.stat(filePath);
          if (stats.isDirectory()) {
            size += await getDirSize(filePath);
          } else {
            size += stats.size;
          }
        }
      } catch (e) {}
      return size;
    };
    const storageBytes = await getDirSize(uploadImagesDir);
    const storageMB = (storageBytes / (1024 * 1024)).toFixed(2);

    // RAM usage (Total memory vs Free memory of the OS, or Process memory)
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const usedMemGB = (usedMem / (1024 * 1024 * 1024)).toFixed(2);
    const totalMemGB = (totalMem / (1024 * 1024 * 1024)).toFixed(2);
    const processMemMB = (process.memoryUsage().rss / (1024 * 1024)).toFixed(2);

    res.json({ 
      success: true, 
      stats: { 
        usersCount, 
        ordersCount, 
        revenue,
        system: {
          storageMB: Number(storageMB),
          ramUsedGB: Number(usedMemGB),
          ramTotalGB: Number(totalMemGB),
          processRamMB: Number(processMemMB),
          osPlatform: os.platform()
        }
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/admin/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, balance: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/admin/users/:id/balance', authenticate, requireAdmin, async (req, res) => {
  try {
    const { amount } = req.body; // Can be positive (add) or negative (subtract)
    const userId = req.params.id;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: Number(amount) } }
    });
    
    // Khuyến khích: Lưu vào bảng Transaction để có lịch sử
    await prisma.transaction.create({
      data: {
        userId,
        amount: Number(amount),
        type: 'DEPOSIT',
        status: 'SUCCESS',
        description: 'Admin điều chỉnh số dư',
        txCode: `ADMIN-${Date.now()}`
      }
    });

    res.json({ success: true, balance: updatedUser.balance });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/admin/orders', authenticate, requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/admin/transactions', authenticate, requireAdmin, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    });
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/admin/transactions/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'SUCCESS' or 'FAILED'
    const tx = await prisma.transaction.findUnique({ where: { id: req.params.id } });
    
    if (tx.status !== 'PENDING') return res.status(400).json({ success: false, message: 'Đã xử lý' });

    if (status === 'SUCCESS') {
      await prisma.$transaction([
        prisma.transaction.update({ where: { id: tx.id }, data: { status: 'SUCCESS' } }),
        prisma.user.update({ where: { id: tx.userId }, data: { balance: { increment: tx.amount } } })
      ]);
    } else {
      await prisma.transaction.update({ where: { id: tx.id }, data: { status: 'FAILED' } });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/admin/feedbacks', authenticate, requireAdmin, async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/admin/feedbacks/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'APPROVED', 'REJECTED' or 'DELETED'
    
    if (status === 'DELETED') {
      await prisma.feedback.delete({ where: { id: req.params.id } });
    } else {
      await prisma.feedback.update({
        where: { id: req.params.id },
        data: { status }
      });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});


// =============================================
// REPORT SYSTEM (User báo cáo lỗi quà tặng)
// =============================================

// User gửi báo cáo (không cần đăng nhập bắt buộc)
app.post('/api/reports', async (req, res) => {
  try {
    const { giftUrl, orderCode, message, userName } = req.body;
    if (!giftUrl || !message) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin báo cáo' });
    }
    let userId = null;
    let uName = userName || 'Ẩn danh';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const u = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (u) { userId = u.id; uName = u.name; }
      } catch (e) {}
    }
    const report = await prisma.report.create({
      data: { userId, userName: uName, giftUrl, orderCode: orderCode || null, message, status: 'PENDING' }
    });
    res.json({ success: true, reportId: report.id });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// Admin xem danh sách báo cáo
app.get('/api/admin/reports', authenticate, requireAdmin, async (req, res) => {
  try {
    const reports = await prisma.report.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Admin cập nhật trạng thái báo cáo
app.post('/api/admin/reports/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await prisma.report.update({ where: { id: req.params.id }, data: { status } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  
  // Tự động Ping chính mình mỗi 12 phút để chống ngủ (không gây quá tải)
  // Cron-job bên ngoài ping mỗi 15 phút → self-ping 12 phút bù vào khoảng trống
  setInterval(async () => {
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl && backendUrl.includes('onrender.com')) {
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 10000); // 10s timeout
        await fetch(`${backendUrl}/ping`, { method: 'GET', signal: ctrl.signal });
        clearTimeout(timeout);
        console.log(`[Self-Ping] OK at ${new Date().toISOString()}`);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('[Self-Ping] Timed out after 10s');
        } else {
          console.error('[Self-Ping] Failed:', error.message);
        }
      }
    }
  }, 12 * 60 * 1000);
});

// Graceful shutdown — đóng Prisma khi server tắt
const gracefulShutdown = async (signal) => {
  console.log(`[${signal}] Graceful shutdown...`);
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
