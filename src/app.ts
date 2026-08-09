import express from 'express';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.middleware.js';

export const app = express();

app.use(notFoundHandler);
app.use(errorHandler);