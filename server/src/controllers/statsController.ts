import express from 'express';
type Request = express.Request;
type Response = express.Response;
import * as statsService from '../services/statsService';

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await statsService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const results = await statsService.searchEntities(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error searching' });
  }
};
