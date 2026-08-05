import express from 'express';
type Request = express.Request;
type Response = express.Response;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEnvironments = async (req: Request, res: Response) => {
  try {
    const environments = await prisma.environment.findMany({
      where: { isDeleted: false },
      include: { certificates: { where: { isDeleted: false } }, customer: true }
    });
    res.json(environments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching environments' });
  }
};

export const getEnvironmentById = async (req: Request, res: Response) => {
  try {
    const environment = await prisma.environment.findUnique({
      where: { id: req.params.id },
      include: { certificates: { where: { isDeleted: false } }, customer: true }
    });
    if (!environment || environment.isDeleted) return res.status(404).json({ error: 'Environment not found' });
    res.json(environment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching environment details' });
  }
};

export const createEnvironment = async (req: Request, res: Response) => {
  try {
    const { name, type, url, ipAddress, dbVersion, appVersion, status, lastDeployment, pedDate } = req.body;
    const env = await prisma.environment.create({
      data: { customerId: req.params.id, name, type, url, ipAddress, dbVersion, appVersion, status, lastDeployment, pedDate }
    });
    res.status(201).json(env);
  } catch (error) {
    res.status(500).json({ error: 'Error creating environment' });
  }
};

export const updateEnvironment = async (req: Request, res: Response) => {
  try {
    const { name, type, url, ipAddress, dbVersion, appVersion, status, lastDeployment, pedDate } = req.body;
    const env = await prisma.environment.update({
      where: { id: req.params.id },
      data: { name, type, url, ipAddress, dbVersion, appVersion, status, lastDeployment, pedDate }
    });
    res.json(env);
  } catch (error) {
    res.status(500).json({ error: 'Error updating environment' });
  }
};

export const deleteEnvironment = async (req: Request, res: Response) => {
  try {
    await prisma.environment.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting environment' });
  }
};

export const createCertificate = async (req: Request, res: Response) => {
  try {
    const { domain, issuer, validFrom, validTo, status } = req.body;
    const cert = await prisma.certificate.create({
      data: { environmentId: req.params.id, domain, issuer, validFrom, validTo, status }
    });
    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Error creating certificate' });
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { domain, issuer, validFrom, validTo, status } = req.body;
    const cert = await prisma.certificate.update({
      where: { id: req.params.id },
      data: { domain, issuer, validFrom, validTo, status }
    });
    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: 'Error updating certificate' });
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    await prisma.certificate.update({
      where: { id: req.params.id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting certificate' });
  }
};


