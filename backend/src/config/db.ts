import { PrismaClient } from "../generated/prisma/client.js"; 
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "./env.js";

// Singleton pattern: avoids exhausting the Postgres connection pool from
// multiple PrismaClient instances during hot-reload in development.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);


export const prisma =
  global.__prisma ??
  new PrismaClient({ 
    adapter,
    log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}
