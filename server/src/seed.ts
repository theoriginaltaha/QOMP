import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const customer1 = await prisma.customer.create({
    data: {
      name: 'Global Education Management Systems (GEMS)',
      code: 'GEMS-001',
      type: 'B2B',
      industry: 'Education',
      status: 'Active',
      contractStatus: 'Signed',
      accountManager: 'Ahmed Youssef',
      customerSuccessManager: 'Sarah Ali',
      supportOwner: 'Tech Support Team A',
      healthScore: 'Good',
      contractStartDate: '2023-01-15',
      contractEndDate: '2025-01-14',
      subscriptionType: 'Enterprise',
      contacts: {
        create: [
          { name: 'Dr. Tarek Hassan', jobTitle: 'IT Director', email: 'tarek@gems.edu', phone: '+971-50-123-4567', isPrimary: true }
        ]
      },
      schools: {
        create: [
          { code: 'GEMS-DUB-01', name: 'GEMS Wellington Academy', educationalStage: 'K-12', city: 'Dubai', status: 'Active' },
          { code: 'GEMS-SHJ-02', name: 'GEMS Millennium School', educationalStage: 'Primary', city: 'Sharjah', status: 'Active' }
        ]
      },
      environments: {
        create: [
          {
            name: 'GEMS Prod DB', type: 'Database', url: 'db.gems.prod.internal', ipAddress: '10.0.1.15', dbVersion: 'PostgreSQL 14', appVersion: 'N/A', status: 'Running', lastDeployment: '2023-11-20',
            certificates: {
              create: [{ domain: '*.gems.edu', issuer: 'Let\'s Encrypt', validFrom: '2023-09-01', validTo: '2024-09-01', status: 'Valid' }]
            },
            tickets: {
              create: [{ ticketId: 'DB-1042', title: 'Optimize Query Performance', type: 'Task', status: 'In Progress', priority: 'Medium', assignee: 'DevOps Team' }]
            }
          }
        ]
      },
      tasks: {
        create: [
          { title: 'Q3 Business Review', priority: 'High', status: 'Pending', dueDate: '2023-09-30', assignee: 'Sarah Ali' }
        ]
      },
      meetings: {
        create: [
          { title: 'Kickoff Sync', type: 'Onboarding', date: '2023-02-01', status: 'Completed', organizer: 'Ahmed Youssef' }
        ]
      },
      renewals: {
        create: [
          { contractValue: '$120,000', renewalDate: '2025-01-14', status: 'Upcoming', owner: 'Ahmed Youssef' }
        ]
      }
    }
  });

  console.log('Seeded successfully!', customer1.name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
