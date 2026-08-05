import express from 'express';
type Request = express.Request;
type Response = express.Response;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { permissions: true }
    });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { permissions: true }
    });
    const safeUsers = users.map(u => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    
    const user = await prisma.user.create({
      data: { name, email, password, role }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const updatePermissions = async (req: Request, res: Response) => {
  try {
    const { permissions } = req.body;
    const userId = req.params.id;

    await prisma.permission.deleteMany({ where: { userId } });
    
    if (permissions && permissions.length > 0) {
      await prisma.permission.createMany({
        data: permissions.map((p: any) => ({
          userId,
          moduleName: p.moduleName,
          canRead: p.canRead,
          canWrite: p.canWrite
        }))
      });
    }
    
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { permissions: true }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating permissions' });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.params.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error marking notification as read' });
  }
};
