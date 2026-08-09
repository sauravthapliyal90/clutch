import { redis } from "../../config/redis.js";
import { env } from "../../config/env.js";
import { hashOtp } from "../../utils/otp.js";

const MAX_ATTEMPTS = 5;
const REQUEST_COOLDOWN = 60; // seconds

interface OtpRecord {
    hash: string;
    attempts: number;
}

function otpKey(phone: string): string {
    return `otp:${phone}`;
}

function cooldownKey(phone: string): string {
    return `otp:cooldown:${phone}`;
}

export async function canRequestOtp(phone: string): Promise<boolean> {
    const onCooldown = await redis.get(cooldownKey(phone));
    if (onCooldown) return false;
    await redis.set(cooldownKey(phone), "1", "EX", REQUEST_COOLDOWN);
    return true;
}

export async function storeOtp(phone: string, otp: string): Promise<void> {
    const record: OtpRecord = { hash: hashOtp(otp), attempts: 0 };
    // pipeline = both commands sent together in one round trip, and since
    // HSET creates the key fresh each time a new OTP is requested, "attempts"
    // always starts back at 0 for the new code.
    const pipeline = redis.pipeline();
    pipeline.hset(otpKey(phone), { hash: hashOtp(otp), attempts: 0 });
    pipeline.expire(otpKey(phone), env.OTP_TTL_SECONDS);
    await pipeline.exec();
}

export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
    const key = otpKey(phone);
    const record = await redis.hgetall(key); // {} if the key doesn't exist
   if (!record.hash) return false;

    if (Number(record.attempts) >= MAX_ATTEMPTS) {
        await redis.del(key);
        return false;
    }
    if (record.hash !== hashOtp(otp)) {
         await redis.hincrby(key, "attempts", 1); 
    }
    return true;
}