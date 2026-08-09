import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/db.js';
import { redis } from './config/redis.js';

// Import workers so they start processing queues when the server boots.
// In production these typically run as a separate process/container
// (see docker-compose.yml) so API request latency is never affected by
// job processing - but importing them here keeps local dev to one command.


const server = app.listen(env.PORT, () => {
  logger.info(`CarMeet API listening on port ${env.PORT} [${env.NODE_ENV}]`);
});


// async function gracefulShutdown(signal: string) {
//   logger.info(`Received ${signal}, shutting down gracefully...`);
//   server.close(async () => {
//     await prisma.$disconnect();
//     redis.disconnect();
//     process.exit(0);
//   });
// }

// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));
