import { Redis } from "ioredis";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const redis = new Redis(env.REDIS_URL,{
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
});

redis.on("connect", () => {
    logger.info("Redis connected successfully");
})

redis.on("ready", () => {
    logger.info("Redis is ready to use");
})

redis.on("error", () => {
    logger.error("Redis connection error");
})

redis.on("close", () => {
    logger.warn("Redis connection closed");
})

redis.on("reconnecting", () => {
    logger.warn("Redis reconnecting...");
})