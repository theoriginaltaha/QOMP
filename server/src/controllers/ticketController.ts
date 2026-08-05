import express from 'express';
type Request = express.Request;
type Response = express.Response;
import * as ticketService from '../services/ticketService';

export const getJiraTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.fetchJiraTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Jira tickets' });
  }
};

export const createJiraTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await ticketService.addJiraTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error creating Jira ticket' });
  }
};

export const deleteJiraTicket = async (req: Request, res: Response) => {
  try {
    await ticketService.removeJiraTicket(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting ticket' });
  }
};

export const getCustomerTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.fetchCustomerTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customer tickets' });
  }
};

export const createCustomerTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await ticketService.addCustomerTicket(req.body, req.file);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error creating customer ticket' });
  }
};

export const deleteCustomerTicket = async (req: Request, res: Response) => {
  try {
    await ticketService.removeCustomerTicket(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting customer ticket' });
  }
};
