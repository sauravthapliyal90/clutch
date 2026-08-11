import pinoHttp from 'pino-http';
import { logger } from '../config/logger.js';

// Propagates a request ID through to every log line for that request,
// enabling traceability across the auth -> service -> repository call chain.
export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] as string ?? crypto.randomUUID(),
});
