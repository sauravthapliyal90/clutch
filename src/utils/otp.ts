import crypto from "node:crypto";
import { env } from "../config/env.js";

export function generateOtp(): string {
    const max = 10 ** env.OTP_LENGTH - 1;
    return crypto.randomInt(0, max).toString().padStart(env.OTP_LENGTH, "0");
}

export function hashOtp(otp: string): string {
    return crypto.createHash("sha256").update(otp).digest("hex");
}