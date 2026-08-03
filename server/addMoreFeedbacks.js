const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const start = new Date('2026-01-01T00:00:00Z');
  const end = new Date();

  const newFeedbacks = [
    {
      userId: 'system-generated-3',
      name: 'Thanh Hải',
      message: 'Web đẹp nhưng ít mẫu free quá, mong ad ra thêm nhiều mẫu miễn phí cho ae học sinh sinh viên',
      rating: 3,
      status: 'APPROVED',
      createdAt: randomDate(start, end)
    },
    {
      userId: 'system-generated-4',
      name: 'Hoàng Tú',
      message: 'ad rep tin nhắn hơi chậm nha, phải chờ mất 1 lúc. Nhưng mà hỗ trợ thì rất nhiệt tình, sửa code dùm luôn, cho 3 sao khuyến khích',
      rating: 3,
      status: 'APPROVED',
      createdAt: randomDate(start, end)
    },
    {
      userId: 'system-generated-5',
      name: 'Bé Nấm',
      message: 'Tạm được, giá template premium hơi cao xíu so vs túi tiền của mình T_T',
      rating: 2,
      status: 'APPROVED',
      createdAt: randomDate(start, end)
    }
  ];

  for (const fb of newFeedbacks) {
    await prisma.feedback.create({ data: fb });
    console.log(`Added feedback for ${fb.name}`);
  }
}

main().finally(() => prisma.$disconnect());
