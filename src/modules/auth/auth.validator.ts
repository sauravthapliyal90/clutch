import { z } from 'zod';

export const requestOtpSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/),
  otp: z.string().length(6),
});

export const completeProfileSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
});

export const adminLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
