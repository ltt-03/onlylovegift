const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupTestAccount() {
  try {
    const email = 'test@onlylovegift.com';
    const password = 'TestBCT2026!';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      console.log('User already exists, updating balance...');
      user = await prisma.user.update({
        where: { email },
        data: {
          balance: 200000,
          password: hashedPassword
        }
      });
      console.log('Test account updated successfully!');
    } else {
      console.log('Creating new test account...');
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'BCT Test Account',
          isEmailVerified: true,
          balance: 200000,
          depositCode: 'TESTBCT'
        }
      });
      console.log('Test account created successfully!');
    }
    
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Balance: ${user.balance}`);

  } catch (error) {
    console.error('Error setting up test account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestAccount();
