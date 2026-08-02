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
  try {
    // Lấy dữ liệu nội dung CK và số tiền từ payload của SePay
    const content = req.body.content || (req.body.data && req.body.data.content) || '';
    const transferAmount = req.body.transferAmount || (req.body.data && req.body.data.transferAmount) || 0;

    // Dùng Regex tìm chữ GL-xxxx trong nội dung (ví dụ: NGUYEN VAN A CHUYEN TIEN GL-1234)
    const match = content.match(/(GL-\d{4})/i);
    
    if (!match) {
      // Nếu không tìm thấy mã đơn hàng, bỏ qua (tiền của người ngoài chuyển)
      return res.json({ success: true, message: 'Ignored: No order code found in content' });
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
});
