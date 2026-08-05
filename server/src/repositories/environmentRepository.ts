import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllEnvironments = async () => {
  return await prisma.environment.findMany({
    where: { isDeleted: false },
    include: { certificates: { where: { isDeleted: false } }, customer: true }
  });
};

export const getEnvironmentById = async (id: string) => {
  return await prisma.environment.findUnique({
    where: { id },
    include: { certificates: { where: { isDeleted: false } }, customer: true }
  });
};

export const createEnvironment = async (data: Prisma.EnvironmentUncheckedCreateInput) => {
  return await prisma.environment.create({ data });
};

export const updateEnvironment = async (id: string, data: Prisma.EnvironmentUpdateInput) => {
  return await prisma.environment.update({ where: { id }, data });
};

export const softDeleteEnvironment = async (id: string) => {
  return await prisma.environment.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() }
  });
};

export const createCertificate = async (data: Prisma.CertificateUncheckedCreateInput) => {
  return await prisma.certificate.create({ data });
};

export const updateCertificate = async (id: string, data: Prisma.CertificateUpdateInput) => {
  return await prisma.certificate.update({ where: { id }, data });
};

export const softDeleteCertificate = async (id: string) => {
  return await prisma.certificate.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() }
  });
};
