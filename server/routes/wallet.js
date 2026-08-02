const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware auth
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Không có token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};

// 1. Lấy thông tin ví và lịch sử giao dịch
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { balance: true }
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json({ success: true, balance: user.balance, transactions });
  } catch (error) {
    console.error('Lỗi lấy thông tin ví:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// 2. Tạo yêu cầu nạp tiền
router.post('/deposit', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Sinh mã giao dịch duy nhất
    const txCode = `NAP-${Math.floor(10000 + Math.random() * 90000)}`;

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId,
        amount: amount || 0, // Nếu amount = 0 nghĩa là nạp bao nhiêu cộng bấy nhiêu
        type: 'DEPOSIT',
        status: 'PENDING',
        txCode,
        description: 'Nạp tiền vào ví'
      }
    });

    res.json({ success: true, transaction });
  } catch (error) {
    console.error('Lỗi tạo giao dịch nạp tiền:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;
