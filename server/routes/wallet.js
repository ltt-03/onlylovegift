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
    let user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { balance: true, depositCode: true }
    });

    // Nếu user chưa có depositCode, tạo mới và lưu lại (đảm bảo tính duy nhất)
    if (!user.depositCode) {
      let newCode;
      let isUnique = false;
      while (!isUnique) {
        newCode = `NAP-${Math.floor(10000 + Math.random() * 90000)}`;
        const existing = await prisma.user.findUnique({ where: { depositCode: newCode } });
        if (!existing) {
          isUnique = true;
        }
      }

      await prisma.user.update({
        where: { id: req.userId },
        data: { depositCode: newCode }
      });
      user.depositCode = newCode;
    }

    // Lấy danh sách giao dịch (chỉ lấy SUCCESS hoặc FAILED, không cần PENDING nữa vì đã bỏ luồng tạo tay)
    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: req.userId,
        status: { not: 'PENDING' }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json({ success: true, balance: user.balance, depositCode: user.depositCode, transactions });
  } catch (error) {
    console.error('Lỗi lấy thông tin ví:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// Đã xóa POST /deposit vì sử dụng mã nạp tiền cố định

module.exports = router;
