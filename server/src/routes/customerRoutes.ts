import { Router } from 'express';
import { 
  getCustomers, getCustomerById, createCustomer, updateAccountTeam, updatePortals, 
  createContact, deleteContact, updateContact, createSchool, updateSchool, 
  createResource, deleteResource, uploadResource, getMeetings, createMeeting, getRenewals, createRenewal, 
  softDeleteCustomer, getRecycleBin, restoreCustomer, hardDeleteCustomer 
} from '../controllers/customerController';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Recycle Bin Routes (Must be before /:id routes to prevent conflict)
router.get('/recycle-bin/customers', getRecycleBin);

// Customer Core Routes
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);
router.get('/customers/:id', getCustomerById);
router.patch('/customers/:id/team', updateAccountTeam);
router.patch('/customers/:id/portals', updatePortals);
router.delete('/customers/:id', softDeleteCustomer);
router.patch('/customers/:id/restore', restoreCustomer);
router.delete('/customers/:id/hard', hardDeleteCustomer);

// Customer Contacts
router.post('/customers/:id/contacts', createContact);
router.delete('/contacts/:id', deleteContact);
router.patch('/contacts/:id', updateContact);

// Customer Schools
router.post('/customers/:id/schools', createSchool);
router.patch('/schools/:id', updateSchool);

// Customer Resources
router.post('/customers/:id/resources', createResource);
router.post('/customers/:id/resources/upload', upload.single('file'), uploadResource);
router.delete('/resources/:id', deleteResource);

// Customer Meetings
router.get('/meetings', getMeetings);
router.post('/customers/:id/meetings', createMeeting);

// Customer Renewals
router.get('/renewals', getRenewals);
router.post('/customers/:id/renewals', createRenewal);

export default router;
