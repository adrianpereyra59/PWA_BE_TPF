import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import ENVIRONMENT from './config/environment.config.js';

import authRoutes from './routes/auth.router.js';
import workspaceRoutes from './routes/workspace.route.js';
import memberRoutes from './routes/member.router.js';

import errorHandler from './utils/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: ENVIRONMENT.URL_FRONTEND || '*',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// health
app.get('/api/status', (req, res) => res.json({ ok: true, message: 'API OK' }));
app.get('/api/ping', (req, res) => res.json({ ok: true, message: 'pong' }));

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/members', memberRoutes);

app.use(errorHandler);

export default app;