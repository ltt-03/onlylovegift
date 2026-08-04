const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.update({
    where: { email: 'admin@onlylovegift.com' },
    data: { password: hashedPassword }
  });
  console.log("Password reset success");
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
