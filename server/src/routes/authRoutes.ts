import { Router } from 'express';
import { login, getUsers, createUser, updatePermissions, getNotifications, markNotificationRead } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.get('/users', getUsers);
router.post('/users', createUser);
router.patch('/users/:id/permissions', updatePermissions);
router.get('/users/:id/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;
