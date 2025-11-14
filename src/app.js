import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import connectDb from './config/db.js';
import authRoutes from './routes/auth.js';
import workspaceRoutes from './routes/workspace.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

connectDb();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/workspace', workspaceRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, message: 'OK' }));

app.use(errorHandler);

export default app;