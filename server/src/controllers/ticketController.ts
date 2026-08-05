import express from 'express';
type Request = express.Request;
type Response = express.Response;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Jira Tickets
export const getJiraTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.jiraTicket.findMany({
      where: { isDeleted: false },
      include: { customer: true }
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Jira tickets' });
  }
};

export const createJiraTicket = async (req: Request, res: Response) => {
  try {
    const { ticketId, title, type, status, priority, assignee, customerId } = req.body;
    let assigneeName = assignee;

    const user = await prisma.user.findUnique({ where: { id: assignee } });
    if (user) {
      assigneeName = user.name;
      await prisma.notification.create({
        data: {
          userId: user.id,
          message: `You were assigned to Ticket ${ticketId}: ${title}`,
          link: `/customers/${customerId}`
        }
      });
    }

    const ticket = await prisma.jiraTicket.create({
      data: { customerId, ticketId, title, type, status, priority, assignee: assigneeName }
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error creating Jira ticket' });
  }
};

export const deleteJiraTicket = async (req: Request, res: Response) => {
  try {
    await prisma.jiraTicket.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting ticket' });
  }
};

// Customer Tickets (Support Portal)
export const getCustomerTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.customerTicket.findMany({
      where: { isDeleted: false },
      include: { customer: true }
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customer tickets' });
  }
};

export const createCustomerTicket = async (req: Request, res: Response) => {
  try {
    const { customerId, title, description, link } = req.body;
    
    let attachmentUrl = link || null;
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const ticket = await prisma.customerTicket.create({
      data: { customerId, title, description, attachmentUrl, status: 'Open' }
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error creating customer ticket' });
  }
};

export const deleteCustomerTicket = async (req: Request, res: Response) => {
  try {
    await prisma.customerTicket.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting customer ticket' });
  }
};
