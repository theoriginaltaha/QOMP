import express from 'express';
type Request = express.Request;
type Response = express.Response;
import * as customerService from '../services/customerService';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerService.fetchCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customers' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.fetchCustomerById(req.params.id);
    res.json(customer);
  } catch (error: any) {
    if (error.message === 'Customer not found') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: 'Error fetching customer' });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.createNewCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error creating customer' });
  }
};

export const updateAccountTeam = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.updateAccountTeam(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error updating account team' });
  }
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const resource = await customerService.addResource(req.params.id, req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error creating resource' });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    await customerService.removeResource(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting resource' });
  }
};

export const uploadResource = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    const resource = await customerService.addResource(req.params.id, { title: req.body.title, type: req.body.type, url: fileUrl });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading resource' });
  }
};

export const updatePortals = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.updatePortals(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Error updating portal links' });
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const contact = await customerService.addContact(req.params.id, req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Error creating contact' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    await customerService.removeContact(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact' });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const contact = await customerService.editContact(req.params.id, req.body);
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact' });
  }
};

export const createSchool = async (req: Request, res: Response) => {
  try {
    const school = await customerService.addSchool(req.params.id, req.body);
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ error: 'Error creating school' });
  }
};

export const updateSchool = async (req: Request, res: Response) => {
  try {
    const school = await customerService.editSchool(req.params.id, req.body);
    res.json(school);
  } catch (error) {
    res.status(500).json({ error: 'Error updating school' });
  }
};

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const meetings = await customerService.fetchMeetings();
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meetings' });
  }
};

export const createMeeting = async (req: Request, res: Response) => {
  try {
    const meeting = await customerService.addMeeting(req.params.id, req.body);
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Error creating meeting' });
  }
};

export const getRenewals = async (req: Request, res: Response) => {
  try {
    const renewals = await customerService.fetchRenewals();
    res.json(renewals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching renewals' });
  }
};

export const createRenewal = async (req: Request, res: Response) => {
  try {
    const renewal = await customerService.addRenewal(req.params.id, req.body);
    res.status(201).json(renewal);
  } catch (error) {
    res.status(500).json({ error: 'Error creating renewal' });
  }
};

export const softDeleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.softDeleteCustomer(req.params.id);
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting customer' });
  }
};

export const getRecycleBin = async (req: Request, res: Response) => {
  try {
    const deletedCustomers = await customerService.fetchRecycleBin();
    res.json(deletedCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recycle bin' });
  }
};

export const restoreCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customerService.restoreCustomer(req.params.id);
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: 'Error restoring customer' });
  }
};

export const hardDeleteCustomer = async (req: Request, res: Response) => {
  try {
    await customerService.hardDeleteCustomer(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error permanently deleting customer' });
  }
};
