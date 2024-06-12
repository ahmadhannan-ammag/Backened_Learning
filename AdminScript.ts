const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Test@1234', 10);
  const adminUser = await prisma.admin.create({
    data: {
      email: 'admin@xyz.com',
      password: password,
      name: 'Test Admin',
    },
  });
  console.log('Admin user created:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });