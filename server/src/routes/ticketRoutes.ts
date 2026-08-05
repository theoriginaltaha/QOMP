import { Router } from 'express';
import { 
  getJiraTickets, createJiraTicket, deleteJiraTicket,
  getCustomerTickets, createCustomerTicket, deleteCustomerTicket
} from '../controllers/ticketController';

const router = Router();

// Jira Tickets
router.get('/tickets/jira', getJiraTickets);
router.post('/customers/:id/tickets/jira', createJiraTicket);
router.delete('/tickets/jira/:id', deleteJiraTicket);

import { upload } from '../middlewares/uploadMiddleware';

// Customer Tickets (Support Portal)
router.get('/tickets/support', getCustomerTickets);
router.post('/customers/:id/tickets/support', upload.single('file'), createCustomerTicket);
router.delete('/tickets/support/:id', deleteCustomerTicket);

export default router;
