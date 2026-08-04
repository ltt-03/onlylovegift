const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, email: true, name: true, password: true }
  });
  console.log("ADMINS:", admins);
  
  const all = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true }
  });
  console.log("ALL USERS:", all);
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
