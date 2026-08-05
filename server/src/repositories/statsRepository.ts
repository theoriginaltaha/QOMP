import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const countActiveCustomers = async () => {
  return await prisma.customer.count({ where: { isDeleted: false } });
};

export const countActiveEnvironments = async () => {
  return await prisma.environment.count({ where: { isDeleted: false, customer: { isDeleted: false } } });
};

export const countActiveJiraTickets = async () => {
  return await prisma.jiraTicket.count({ where: { isDeleted: false, status: { not: 'Done' }, customer: { isDeleted: false } } });
};

export const countPendingTasks = async () => {
  return await prisma.task.count({ where: { isDeleted: false, status: { not: 'Completed' }, customer: { isDeleted: false } } });
};

export const searchCustomers = async (query: string) => {
  return await prisma.customer.findMany({
    where: {
      isDeleted: false,
      OR: [
        { name: { contains: query } },
        { code: { contains: query } }
      ]
    },
    take: 5
  });
};

export const searchSchools = async (query: string) => {
  return await prisma.school.findMany({
    where: {
      customer: { isDeleted: false },
      OR: [
        { name: { contains: query } },
        { code: { contains: query } }
      ]
    },
    include: { customer: true },
    take: 5
  });
};
