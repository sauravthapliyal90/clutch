import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();


const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(4000),

    DATABASE_URL: z.url({error: "DATABASE_URL must be a valid URL",}),
    REDIS_URL: z.url({error: "REDIS_URL is required",}),

    JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
    JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

    OTP_TTL_SECONDS: z.coerce.number().default(300),
    OTP_LENGTH: z.coerce.number().default(6),

    SMS_PROVIDER_API_KEY: z.string().optional(),

    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    RC_VERIFICATION_API_URL: z.url({error: "RC_VERIFICATION_API_URL must be a valid URL",}).optional(),
    RC_VERIFICATION_API_KEY: z.string().optional(),

    CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);
console.log('✅ Environment variables loaded successfully', parsed);
if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('❌ Invalid environment variables:');
    process.exit(1);
}
console.log('✅ Environment variables loaded successfully', parsed);
export const env = parsed.data;
