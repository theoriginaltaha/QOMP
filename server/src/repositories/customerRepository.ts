import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllActiveCustomers = async () => {
  return await prisma.customer.findMany({
    where: { isDeleted: false },
    include: { 
      environments: { where: { isDeleted: false } }, 
      contacts: { where: { isDeleted: false } }, 
      schools: { where: { isDeleted: false } }, 
      tasks: { where: { isDeleted: false } }, 
      meetings: { where: { isDeleted: false } }, 
      renewals: { where: { isDeleted: false } } 
    }
  });
};

export const getCustomerById = async (id: string) => {
  return await prisma.customer.findUnique({
    where: { id },
    include: { 
      environments: { where: { isDeleted: false } }, 
      contacts: { where: { isDeleted: false } }, 
      schools: { where: { isDeleted: false }, include: { contacts: { where: { isDeleted: false } } } }, 
      tasks: { where: { isDeleted: false } }, 
      meetings: { where: { isDeleted: false } }, 
      renewals: { where: { isDeleted: false } },
      resources: { where: { isDeleted: false } },
      jiraTickets: { where: { isDeleted: false } },
      customerTickets: { where: { isDeleted: false } }
    }
  });
};

export const createCustomer = async (data: Prisma.CustomerUncheckedCreateInput) => {
  return await prisma.customer.create({ data });
};

export const updateCustomer = async (id: string, data: Prisma.CustomerUpdateInput) => {
  return await prisma.customer.update({ where: { id }, data });
};

export const deleteCustomer = async (id: string) => {
  return await prisma.customer.delete({ where: { id } });
};

export const getDeletedCustomers = async () => {
  return await prisma.customer.findMany({
    where: { isDeleted: true },
    include: { environments: true, tasks: true }
  });
};

export const createResource = async (data: Prisma.CustomerResourceUncheckedCreateInput) => {
  return await prisma.customerResource.create({ data });
};

export const deleteResource = async (id: string) => {
  return await prisma.customerResource.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() }
  });
};

export const createContact = async (data: Prisma.ContactUncheckedCreateInput) => {
  return await prisma.contact.create({ data });
};

export const updateContact = async (id: string, data: Prisma.ContactUpdateInput) => {
  return await prisma.contact.update({ where: { id }, data });
};

export const deleteContact = async (id: string) => {
  return await prisma.contact.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() }
  });
};

export const createSchool = async (data: Prisma.SchoolUncheckedCreateInput) => {
  return await prisma.school.create({ data });
};

export const updateSchool = async (id: string, data: Prisma.SchoolUpdateInput) => {
  return await prisma.school.update({ where: { id }, data });
};

export const getMeetings = async () => {
  return await prisma.meeting.findMany({ where: { isDeleted: false }, include: { customer: true } });
};

export const createMeeting = async (data: Prisma.MeetingUncheckedCreateInput) => {
  return await prisma.meeting.create({ data });
};

export const getRenewals = async () => {
  return await prisma.renewal.findMany({ where: { isDeleted: false }, include: { customer: true } });
};

export const createRenewal = async (data: Prisma.RenewalUncheckedCreateInput) => {
  return await prisma.renewal.create({ data });
};
