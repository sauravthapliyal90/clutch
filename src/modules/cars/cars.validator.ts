import { z } from 'zod';

export const createCarSchema = z.object({
  model: z.string().min(1).max(100),
  color: z.string().min(1).max(40),
  rcNumber: z.string().min(4).max(20),
});
