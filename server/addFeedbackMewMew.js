const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.feedback.create({
    data: {
      userId: 'system-generated-2',
      name: 'mewmew',
      message: 'quà đẹp tạo nhanh rẻ hơn so với các web khác, nchung là uy tín sẽ ủng hộ dài, ad sớm ra sản phẩm mới về dịp 2/9 hay là 20/10',
      rating: 5,
      status: 'APPROVED'
    }
  });
  console.log('Added feedback for mewmew');
}

main().finally(() => prisma.$disconnect());
