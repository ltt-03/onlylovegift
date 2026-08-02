const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d',
  });
};

// 1. Register with Email & Password
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create verification token
    const verificationToken = require('crypto').randomBytes(32).toString('hex');

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    // Send welcome/verification email (only if email config is provided)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await transporter.sendMail({
        from: `"LoveGift" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Chào mừng bạn đến với LoveGift',
        html: `<h2>Chào ${name},</h2><p>Cảm ơn bạn đã đăng ký LoveGift! Bạn đã có thể bắt đầu tạo những món quà bất ngờ ngay bây giờ.</p><p>Để bảo vệ tài khoản tốt hơn (giúp lấy lại mật khẩu khi quên), bạn có thể click vào link sau để xác minh email:</p><a href="${verifyUrl}" style="background:#ff6b9e;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">Xác minh email</a>`,
      });
    }

    const token = generateToken(user.id);
    res.json({ 
      success: true, 
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// 2. Login with Email & Password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Tài khoản không tồn tại!' });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, message: 'Tài khoản này được đăng ký bằng Google. Vui lòng sử dụng Đăng nhập bằng Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác!' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực trước khi đăng nhập!' 
      });
    }

    const token = generateToken(user.id);
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// 3. Verify Email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, verificationToken: null }
    });

    res.json({ success: true, message: 'Xác minh email thành công!' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// 4. Google Login
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ success: false, message: 'Google Login chưa được cấu hình (Thiếu Client ID).' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Security Check: Prevent Google ID collision
      if (user.googleId && user.googleId !== googleId) {
        return res.status(409).json({
          success: false,
          message: 'Tài khoản Email này đã được liên kết với một tài khoản Google khác!'
        });
      }

      // Update googleId and force email verification if not done yet
      if (!user.googleId || !user.isEmailVerified) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, isEmailVerified: true }
        });
      }
    } else {
      // Create new user via Google
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          isEmailVerified: true, // Google emails are already verified
        }
      });
    }

    const token = generateToken(user.id);
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ success: false, message: 'Lỗi xác thực Google' });
  }
});

// 5. Get current user profile (using token)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Không có token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, isEmailVerified: true, balance: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
});

module.exports = router;
