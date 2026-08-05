import express from 'express';
type Request = express.Request;
type Response = express.Response;
import * as environmentService from '../services/environmentService';

export const getEnvironments = async (req: Request, res: Response) => {
  try {
    const environments = await environmentService.fetchEnvironments();
    res.json(environments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching environments' });
  }
};

export const getEnvironmentById = async (req: Request, res: Response) => {
  try {
    const environment = await environmentService.fetchEnvironmentDetails(req.params.id);
    res.json(environment);
  } catch (error: any) {
    if (error.message === 'Environment not found') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Error fetching environment details' });
  }
};

export const createEnvironment = async (req: Request, res: Response) => {
  try {
    const env = await environmentService.addEnvironment(req.params.id, req.body);
    res.status(201).json(env);
  } catch (error) {
    res.status(500).json({ error: 'Error creating environment' });
  }
};

export const updateEnvironment = async (req: Request, res: Response) => {
  try {
    const env = await environmentService.editEnvironment(req.params.id, req.body);
    res.json(env);
  } catch (error) {
    res.status(500).json({ error: 'Error updating environment' });
  }
};

export const deleteEnvironment = async (req: Request, res: Response) => {
  try {
    await environmentService.removeEnvironment(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting environment' });
  }
};

export const createCertificate = async (req: Request, res: Response) => {
  try {
    const cert = await environmentService.addCertificate(req.params.id, req.body);
    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Error creating certificate' });
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const cert = await environmentService.editCertificate(req.params.id, req.body);
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Error updating certificate' });
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    await environmentService.removeCertificate(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting certificate' });
  }
};
