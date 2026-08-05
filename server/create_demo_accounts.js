const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoAccounts() {
  const accounts = [
    { email: 'demo1@gift.vn', password: 'demo123', name: 'Demo 1' },
    { email: 'demo2@gift.vn', password: 'demo456', name: 'Demo 2' },
  ];

  for (const acc of accounts) {
    const hashed = await bcrypt.hash(acc.password, 10);

    // Upsert: nếu đã tồn tại thì cập nhật, chưa có thì tạo mới
    const user = await prisma.user.upsert({
      where: { email: acc.email },
      update: {
        password: hashed,
        balance: 300000,
        isEmailVerified: true,
        name: acc.name
      },
      create: {
        email: acc.email,
        password: hashed,
        name: acc.name,
        balance: 300000,
        isEmailVerified: true,
        role: 'USER'
      }
    });

    console.log(`✅ Tạo xong: ${acc.email} | Mật khẩu: ${acc.password} | Số dư: 300.000đ`);
  }

  console.log('\n🎉 Tất cả tài khoản demo đã sẵn sàng!');
  await prisma.$disconnect();
}

createDemoAccounts().catch(e => {
  console.error(e);
  process.exit(1);
});
