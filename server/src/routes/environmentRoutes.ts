import { Router } from 'express';
import { 
  getEnvironments, getEnvironmentById, createEnvironment, updateEnvironment, deleteEnvironment, 
  createCertificate, updateCertificate, deleteCertificate
} from '../controllers/environmentController.ts';

const router = Router();

router.get('/environments', getEnvironments);
router.get('/environments/:id', getEnvironmentById);
router.post('/customers/:id/environments', createEnvironment);
router.patch('/environments/:id', updateEnvironment);
router.delete('/environments/:id', deleteEnvironment);

// Certificates
router.post('/environments/:id/certificates', createCertificate);
router.patch('/certificates/:id', updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

export default router;
