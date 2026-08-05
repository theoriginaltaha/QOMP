import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding admin user...');

  const adminEmail = 'admin@qomp.com';
  
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        name: 'System Admin',
        email: adminEmail,
        password: 'admin', // Simple for MVP
        role: 'Admin',
        permissions: {
          create: [
            { moduleName: 'Customers', canRead: true, canWrite: true },
            { moduleName: 'CustomerSuccess', canRead: true, canWrite: true },
            { moduleName: 'Environments', canRead: true, canWrite: true },
            { moduleName: 'Settings', canRead: true, canWrite: true },
          ]
        }
      }
    });
    console.log(`Admin user created: ${admin.email}`);
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
