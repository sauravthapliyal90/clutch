import pino from "pino";
import { env } from "./env.js";

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug', // Set log level based on environment

  base: undefined, // Remove default fields like pid and hostname from logs

  redact: {  // Redact sensitive information from logs
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.otp',
      'req.body.phone',
      'req.body.refreshToken',
      'req.body.accessToken',
      '*.passwordHash',
      '*.tokenHash',
    ],
    censor: '[REDACTED]',
  },

  transport:  // Use pino-pretty for development, otherwise no transport
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname', 
          },
        }
      : undefined,
});