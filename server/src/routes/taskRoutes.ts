import express from 'express';
const { Router } = express;
import { getAllTasks, createTask, updateTaskStatus, deleteTask } from '../controllers/taskController';

const router = Router();

// Get all tasks globally
router.get('/tasks', getAllTasks);

// Create a task (can be attached to a specific customer route OR globally if body contains customerId)
router.post('/customers/:customerId/tasks', createTask);
router.post('/tasks', createTask); // Global task creation

// Update task status
router.patch('/tasks/:id', updateTaskStatus);

// Delete task
router.delete('/tasks/:id', deleteTask);

export default router;
