import express from 'express';
import cors from 'cors';
import customerRoutes from './routes/customerRoutes.ts';
import environmentRoutes from './routes/environmentRoutes.ts';
import authRoutes from './routes/authRoutes.ts';
import statsRoutes from './routes/statsRoutes.ts';
import taskRoutes from './routes/taskRoutes.ts';
import ticketRoutes from './routes/ticketRoutes.ts';
import { initSslCronJob } from './services/sslCronService.ts';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Mount the routes
app.use('/api', authRoutes);
app.use('/api', statsRoutes);
app.use('/api', customerRoutes);
app.use('/api', environmentRoutes);
app.use('/api', taskRoutes);
app.use('/api', ticketRoutes);

// Initialize Background Jobs
initSslCronJob();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Full-Stack Backend Server running on http://localhost:${PORT}`);
});
