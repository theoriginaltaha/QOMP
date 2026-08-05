import express from 'express';
type Request = express.Request;
type Response = express.Response;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
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
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customers' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
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
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customer' });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, code, type, industry, websiteUrl, studentPortalUrl, teacherPortalUrl } = req.body;
    const newCustomer = await prisma.customer.create({
      data: {
        name, code, type, industry, websiteUrl, studentPortalUrl, teacherPortalUrl,
        status: 'Active', contractStatus: 'Draft', accountManager: 'Unassigned',
        customerSuccessManager: 'Unassigned', supportOwner: 'Unassigned', healthScore: 'Neutral',
        contractStartDate: new Date().toISOString().split('T')[0],
        contractEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        subscriptionType: 'Standard'
      }
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Error creating customer' });
  }
};

export const updateAccountTeam = async (req: Request, res: Response) => {
  try {
    const { accountManager, customerSuccessManager, supportOwner } = req.body;
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { accountManager, customerSuccessManager, supportOwner }
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error updating account team' });
  }
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const { title, type, url } = req.body;
    const resource = await prisma.customerResource.create({
      data: { customerId: req.params.id, title, type, url }
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error creating resource' });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    await prisma.customerResource.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting resource' });
  }
};

export const uploadResource = async (req: Request, res: Response) => {
  try {
    const { title, type } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Construct the URL to access the file statically
    const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    
    const resource = await prisma.customerResource.create({
      data: { customerId: req.params.id, title, type, url: fileUrl }
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading resource' });
  }
};

export const updatePortals = async (req: Request, res: Response) => {
  try {
    const { websiteUrl, studentPortalUrl, teacherPortalUrl } = req.body;
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { websiteUrl, studentPortalUrl, teacherPortalUrl }
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error updating portal links' });
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, jobTitle, email, phone, isPrimary, schoolId } = req.body;
    const contact = await prisma.contact.create({
      data: { customerId: req.params.id, name, jobTitle, email, phone, isPrimary, schoolId }
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Error creating contact' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    await prisma.contact.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact' });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const { name, jobTitle, email, phone, isPrimary } = req.body;
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { name, jobTitle, email, phone, isPrimary }
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact' });
  }
};

export const createSchool = async (req: Request, res: Response) => {
  try {
    const { code, name, educationalStage, city, status, studentPortalUrl, teacherPortalUrl, coordinatorName, coordinatorPhone, coordinatorEmail } = req.body;
    const school = await prisma.school.create({
      data: { customerId: req.params.id, code, name, educationalStage, city, status, studentPortalUrl, teacherPortalUrl }
    });
    
    if (coordinatorName) {
      await prisma.contact.create({
        data: {
          customerId: req.params.id,
          schoolId: school.id,
          name: coordinatorName,
          jobTitle: 'Coordinator',
          phone: coordinatorPhone || '',
          email: coordinatorEmail || '',
          isPrimary: true
        }
      });
    }
    
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ error: 'Error creating school' });
  }
};

export const updateSchool = async (req: Request, res: Response) => {
  try {
    const { code, name, educationalStage, city, status, studentPortalUrl, teacherPortalUrl } = req.body;
    const school = await prisma.school.update({
      where: { id: req.params.id },
      data: { code, name, educationalStage, city, status, studentPortalUrl, teacherPortalUrl }
    });
    res.json(school);
  } catch (error) {
    res.status(500).json({ error: 'Error updating school' });
  }
};

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const meetings = await prisma.meeting.findMany({ where: { isDeleted: false }, include: { customer: true } });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meetings' });
  }
};

export const createMeeting = async (req: Request, res: Response) => {
  try {
    const { title, type, date, status, organizer } = req.body;
    const meeting = await prisma.meeting.create({
      data: { customerId: req.params.id, title, type, date, status, organizer }
    });
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Error creating meeting' });
  }
};

export const getRenewals = async (req: Request, res: Response) => {
  try {
    const renewals = await prisma.renewal.findMany({ where: { isDeleted: false }, include: { customer: true } });
    res.json(renewals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching renewals' });
  }
};

export const createRenewal = async (req: Request, res: Response) => {
  try {
    const { renewalDate, status, owner } = req.body;
    const renewal = await prisma.renewal.create({
      data: { customerId: req.params.id, renewalDate, status, owner }
    });
    res.status(201).json(renewal);
  } catch (error) {
    res.status(500).json({ error: 'Error creating renewal' });
  }
};

export const softDeleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting customer' });
  }
};

export const getRecycleBin = async (req: Request, res: Response) => {
  try {
    const deletedCustomers = await prisma.customer.findMany({
      where: { isDeleted: true },
      include: { environments: true, tasks: true }
    });
    res.json(deletedCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recycle bin' });
  }
};

export const restoreCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { isDeleted: false, deletedAt: null }
    });
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: 'Error restoring customer' });
  }
};

export const hardDeleteCustomer = async (req: Request, res: Response) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error permanently deleting customer' });
  }
};
