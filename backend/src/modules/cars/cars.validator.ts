import { z } from 'zod';

// cars.validator.ts
export const createCarSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  model: z.string().min(1).max(100),
  color: z.string().min(1).max(40),
  rcNumber: z.string().min(4).max(20),
  imageUrl: z.string().url().optional(),
});