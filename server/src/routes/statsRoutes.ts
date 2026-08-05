import { Router } from 'express';
import { getStats, search } from '../controllers/statsController.ts';

const router = Router();

router.get('/stats', getStats);
router.get('/search', search);

export default router;
