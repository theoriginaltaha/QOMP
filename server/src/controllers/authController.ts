import express from 'express';
type Request = express.Request;
type Response = express.Response;
import * as authService from '../services/authService';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    res.json({ user });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Login error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await authService.fetchAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.message === 'Email already exists') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const updatePermissions = async (req: Request, res: Response) => {
  try {
    const { permissions } = req.body;
    const userId = req.params.id;
    const updatedUser = await authService.updateUserPermissions(userId, permissions);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating permissions' });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await authService.fetchNotifications(req.params.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const notification = await authService.readNotification(req.params.id);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error marking notification as read' });
  }
};
