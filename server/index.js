const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

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

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

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

// 1. Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { templateId, senderName, receiverName, message, musicUrl } = req.body;
    
    const order = await prisma.order.create({
      data: {
        orderCode: generateOrderCode(),
        templateId,
        senderName,
        receiverName,
        message,
        musicUrl,
        amount: 99000,
        status: 'PENDING'
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
      const txCode = napMatch[1].toUpperCase();
      const transaction = await prisma.transaction.findUnique({ where: { txCode } });
      
      if (transaction && transaction.status === 'PENDING') {
        // Cập nhật số dư ví
        await prisma.user.update({
          where: { id: transaction.userId },
          data: { balance: { increment: Number(transferAmount) } }
        });
        
        // Cập nhật trạng thái giao dịch
        await prisma.transaction.update({
          where: { txCode },
          data: { 
            status: 'SUCCESS',
            amount: Number(transferAmount) // Cập nhật đúng số tiền khách nạp
          }
        });
        return res.json({ success: true, message: 'Deposit successful' });
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
        // Cập nhật trạng thái thành PAID
        await prisma.order.update({
          where: { orderCode },
          data: { status: 'PAID' }
        });

        // Giả lập Deploy Web (Thực tế sẽ gọi Vercel API ở đây)
        setTimeout(async () => {
          await prisma.order.update({
            where: { orderCode },
            data: { 
              status: 'SUCCESS',
              deployUrl: `${process.env.BACKEND_URL || 'http://localhost:3001'}/gift/lucky-chance?code=${order.orderCode}`
            }
          });
        }, 5000);

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
const jwt = require('jsonwebtoken');
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

    // Giả lập Deploy Web sau khi thanh toán
    setTimeout(async () => {
      await prisma.order.update({
        where: { orderCode: code },
        data: { 
          status: 'SUCCESS',
          deployUrl: `${process.env.BACKEND_URL || 'http://localhost:3001'}/gift/lucky-chance?code=${code}`
        }
      });
    }, 4000);

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
    await prisma.order.update({
      where: { orderCode: code },
      data: { status: 'PAID' }
    });

    setTimeout(async () => {
      await prisma.order.update({
        where: { orderCode: code },
        data: { 
          status: 'SUCCESS',
          deployUrl: `${process.env.BACKEND_URL || 'http://localhost:3001'}/gift/lucky-chance?code=${code}`
        }
      });
    }, 4000);

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
