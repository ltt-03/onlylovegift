const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'huongduong6803@gmail.com', name: 'dương hướng', msg: 'Web đẹp, dễ xài. Làm tặng vk bả khoái lắm =))', rating: 5 },
    { email: 'tootrang00@gmail.com', name: 'Too Trang', msg: 'Mẫu giao diện cũng ok nma m đổi màu dc k shop, nói chung 4* thoi', rating: 4 },
    { email: '201minhlam@gmail.com', name: 'Lam Minh', msg: 'Tốc độ load hơi chậm lúc mới vào, bù lại web làm xịn. cho 5 sao ủng hộ', rating: 5 },
    { email: 'nyj9995@gmail.com', name: 'Ny John', msg: 'đẹp phết, tks ad', rating: 5 }
  ];

  for (let u of users) {
    const dbUser = await prisma.user.findUnique({ where: { email: u.email } });
    if (dbUser) {
      await prisma.feedback.create({
        data: {
          userId: dbUser.id,
          name: dbUser.name || u.name,
          message: u.msg,
          rating: u.rating,
          status: 'APPROVED'
        }
      });
      console.log(`Added feedback for ${u.name}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
