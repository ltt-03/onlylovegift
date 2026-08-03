const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const feedbacks = await prisma.feedback.findMany();
  
  const avatars = {
    'mewmew': '/images/avt2.jpg',
    'Emi Sadgirl': '/images/avt1.jpg',
    'Ngọc Trân': '/images/avt3.jpg'
  };

  const start = new Date('2026-01-01T00:00:00Z');
  const end = new Date();

  for (let fb of feedbacks) {
    const avatar = avatars[fb.name] || null;
    const createdAt = randomDate(start, end);
    
    await prisma.feedback.update({
      where: { id: fb.id },
      data: { avatar, createdAt }
    });
    console.log(`Updated ${fb.name} - ${createdAt.toISOString()}`);
  }
}

main().finally(() => prisma.$disconnect());
