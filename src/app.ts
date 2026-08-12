import express from 'express';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.middleware.js';
import cors from 'cors';
import { env } from '@config/env.js';
import routes from "./routes/index"

export const app = express();


app.use(
  cors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);