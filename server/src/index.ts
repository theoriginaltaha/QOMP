import express from 'express';
import cors from 'cors';
import customerRoutes from './routes/customerRoutes';
import environmentRoutes from './routes/environmentRoutes';
import authRoutes from './routes/authRoutes';
import statsRoutes from './routes/statsRoutes';
import taskRoutes from './routes/taskRoutes';
import ticketRoutes from './routes/ticketRoutes';
import { initSslCronJob } from './services/sslCronService';

import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory (only locally)
if (!process.env.VERCEL) {
  // app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
}

// Mount the routes
app.use('/api', authRoutes);
app.use('/api', statsRoutes);
app.use('/api', customerRoutes);
app.use('/api', environmentRoutes);
app.use('/api', taskRoutes);
app.use('/api', ticketRoutes);

// Initialize Background Jobs only locally
if (!process.env.VERCEL) {
  initSslCronJob();
}

// Start Server only if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Full-Stack Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
