import express from 'express';
type Request = express.Request;
type Response = express.Response;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req: Request, res: Response) => {
  try {
    const customerCount = await prisma.customer.count({ where: { isDeleted: false } });
    const envCount = await prisma.environment.count({ where: { isDeleted: false, customer: { isDeleted: false } } });
    const activeTickets = await prisma.jiraTicket.count({ where: { isDeleted: false, status: { not: 'Done' }, customer: { isDeleted: false } } });
    const pendingTasks = await prisma.task.count({ where: { isDeleted: false, status: { not: 'Completed' }, customer: { isDeleted: false } } });

    // Mock data for integration with external platform
    const userCount = 42500;
    const questionsCount = 15420;
    const examsCount = 385;

    res.json({ customerCount, envCount, activeTickets, pendingTasks, userCount, questionsCount, examsCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.json({ customers: [], schools: [] });
    
    const customers = await prisma.customer.findMany({
      where: {
        isDeleted: false,
        OR: [
          { name: { contains: query } },
          { code: { contains: query } }
        ]
      },
      take: 5
    });

    const schools = await prisma.school.findMany({
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
    
    res.json({ customers, schools });
  } catch (error) {
    res.status(500).json({ error: 'Error searching' });
  }
};
