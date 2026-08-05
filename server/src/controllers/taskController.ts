import express from 'express';
type Request = express.Request;
type Response = express.Response;
import * as taskService from '../services/taskService';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.fetchAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params; 
    const { title, priority, status, dueDate, assignee } = req.body;
    
    const task = await taskService.createNewTask({
      customerId: customerId || req.body.customerId,
      title,
      priority,
      status,
      dueDate,
      assignee
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
    const task = await taskService.changeTaskStatus(req.params.id, status);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task status' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await taskService.removeTask(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};
