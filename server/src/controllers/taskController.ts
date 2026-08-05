import express from 'express';
const { Request, Response } = express;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({ where: { isDeleted: false }, include: { customer: true } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params; // Or from body if we want a global route without param
    const { title, priority, status, dueDate, assignee } = req.body;
    let assigneeName = assignee;
    
    // If the assignee is a valid user ID, create a notification
    const user = await prisma.user.findUnique({ where: { id: assignee } });
    if (user) {
      assigneeName = user.name;
      await prisma.notification.create({
        data: {
          userId: user.id,
          message: `You were assigned to a Success Task: ${title}`,
          link: `/customers/${customerId || req.body.customerId}`
        }
      });
    }

    const task = await prisma.task.create({
      data: { 
        customerId: customerId || req.body.customerId, 
        title, 
        priority, 
        status, 
        dueDate, 
        assignee: assigneeName 
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating task' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task status' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await prisma.task.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};

