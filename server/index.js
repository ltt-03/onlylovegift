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
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
// ----------------------------------------------------
// DYNAMIC GIFT TEMPLATES (must be before static files)
// ----------------------------------------------------
app.get('/gift/lucky-chance', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send('Thiếu mã đơn hàng');
    
    const order = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!order || order.status !== 'SUCCESS') {
      return res.status(404).send('Không tìm thấy món quà hoặc đơn hàng chưa thanh toán hoàn tất.');
    }

    const htmlPath = path.join(__dirname, 'public', 'templates', 'lucky-chance', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Create the dynamic data
    const dynamicData = {
      recipientName: order.receiverName,
      messages: order.message.split('\n').filter(msg => msg.trim() !== ''),
      images: [],
      music: order.musicUrl || "../uploads/music/song_1783337224_677.mp3"
    };

    const dataScript = `window.luckyChanceData = ${JSON.stringify(dynamicData)};`;
    
    // Replace the default data in the HTML with the real order data
    html = html.replace(
      /window\.luckyChanceData\s*=\s*\{.*?\};/s, 
      dataScript
    );

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
app.use('/templates', express.static(path.join(__dirname, 'templates')));

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
    const htmlPath = path.join(__dirname, 'templates', templateId, 'index.html');
    
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

// Lightweight Ping Route for UptimeRobot (Giữ server luôn thức)
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
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

// 1. Create a new order (Requires Login & handles images via ImgBB)
app.post('/api/orders', authenticate, upload.array('images', 4), async (req, res) => {
  try {
    const { templateId, senderName, receiverName, birthday, message, musicUrl } = req.body;
    
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      if (process.env.IMGBB_API_KEY) {
        // Upload to ImgBB
        for (const file of req.files) {
          try {
            const formData = new FormData();
            const fileStream = fs.createReadStream(file.path);
            formData.append('image', fileStream);
            const imgbbRes = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, formData, {
              headers: formData.getHeaders()
            });
            if (imgbbRes.data && imgbbRes.data.success) {
              uploadedImages.push(imgbbRes.data.data.url);
            }
          } catch (uploadErr) {
            console.error('ImgBB Upload Error:', uploadErr.response ? uploadErr.response.data : uploadErr.message);
            // Fallback to local if ImgBB fails
            uploadedImages.push(`/uploads/images/${file.filename}`);
          } finally {
            // Delete the local file after uploading to ImgBB
            try {
              if (process.env.IMGBB_API_KEY) {
                fs.unlinkSync(file.path);
              }
            } catch (e) {}
          }
        }
      } else {
        // Fallback to local storage if no ImgBB key is provided
        uploadedImages = req.files.map(file => `/uploads/images/${file.filename}`);
      }
    }

    // Giảm giá lần đầu: Kiểm tra xem user đã có đơn hàng nào thanh toán thành công chưa
    const successfulOrderCount = await prisma.order.count({
      where: { 
        userId: req.user.id,
        status: { in: ['PAID', 'DEPLOYING', 'SUCCESS'] }
      }
    });

    const finalAmount = successfulOrderCount === 0 ? 29000 : 49000;

    const order = await prisma.order.create({
      data: {
        orderCode: generateOrderCode(),
        templateId,
        senderName,
        receiverName,
        birthday,
        message,
        musicUrl,
        amount: finalAmount,
        status: 'PENDING',
        userId: req.user.id,
        images: uploadedImages.length > 0 ? JSON.stringify(uploadedImages) : null
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
  // BẢO MẬT: Kiểm tra API Key từ SePay
  const apiKey = req.headers['authorization'] || req.headers['apikey'] || req.headers['x-api-key'];
  // Nếu có cài đặt SEPAY_API_KEY trong môi trường thì bắt buộc phải khớp
  if (process.env.SEPAY_API_KEY) {
    const expectedKey = `Bearer ${process.env.SEPAY_API_KEY}`;
    if (apiKey !== expectedKey && apiKey !== process.env.SEPAY_API_KEY) {
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

// 4. Mock Vercel Deploy Endpoint (for testing frontend before Webhooks are set up)
app.post('/api/orders/:code/mock-pay', async (req, res) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  
  // Tự động Ping chính mình mỗi 5 phút (300000ms) để chống ngủ
  setInterval(async () => {
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl && backendUrl.includes('onrender.com')) {
      try {
        await fetch(`${backendUrl}/ping`, { method: 'HEAD' });
        console.log('Self-ping successful');
      } catch (error) {
        console.error('Self-ping failed:', error.message);
      }
    }
  }, 5 * 60 * 1000);
});
