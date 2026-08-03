const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.feedback.create({
    data: {
      userId: 'system-generated-1',
      name: 'leminhtri3654',
      message: 'gift hay nhưng hơi ít sản phẩm, ủng hộ ad cốc cf lấy động lực ',
      rating: 5,
      status: 'APPROVED'
    }
  });
  console.log('Added feedback for leminhtri3654');
}

main().finally(() => prisma.$disconnect());
