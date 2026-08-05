import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllActiveTasks = async () => {
  return await prisma.task.findMany({ where: { isDeleted: false }, include: { customer: true } });
};

export const createTask = async (data: Prisma.TaskUncheckedCreateInput) => {
  return await prisma.task.create({ data });
};

export const updateTaskStatus = async (id: string, status: string) => {
  return await prisma.task.update({
    where: { id },
    data: { status }
  });
};

export const softDeleteTask = async (id: string) => {
  return await prisma.task.update({
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
