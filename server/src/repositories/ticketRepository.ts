import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllJiraTickets = async () => {
  return await prisma.jiraTicket.findMany({
    where: { isDeleted: false },
    include: { customer: true }
  });
};

export const createJiraTicket = async (data: Prisma.JiraTicketUncheckedCreateInput) => {
  return await prisma.jiraTicket.create({ data });
};

export const softDeleteJiraTicket = async (id: string) => {
  return await prisma.jiraTicket.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() }
  });
};

export const getAllCustomerTickets = async () => {
  return await prisma.customerTicket.findMany({
    where: { isDeleted: false },
    include: { customer: true }
  });
};

export const createCustomerTicket = async (data: Prisma.CustomerTicketUncheckedCreateInput) => {
  return await prisma.customerTicket.create({ data });
};

export const softDeleteCustomerTicket = async (id: string) => {
  return await prisma.customerTicket.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() }
  });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const createNotification = async (data: Prisma.NotificationUncheckedCreateInput) => {
  return await prisma.notification.create({ data });
};
