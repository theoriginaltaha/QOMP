import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { permissions: true }
  });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { permissions: true }
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: { permissions: true }
  });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data });
};

export const deleteUserPermissions = async (userId: string) => {
  return await prisma.permission.deleteMany({ where: { userId } });
};

export const createUserPermissions = async (permissions: Prisma.PermissionCreateManyInput[]) => {
  return await prisma.permission.createMany({ data: permissions });
};

export const getNotificationsByUserId = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20
  });
};

export const updateNotificationReadStatus = async (id: string, isRead: boolean) => {
  return await prisma.notification.update({
    where: { id },
    data: { isRead }
  });
};
