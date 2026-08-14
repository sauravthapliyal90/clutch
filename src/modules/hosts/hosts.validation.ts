import { z } from 'zod';

export const approveHostSchema = z.object({
  userId: z.string().uuid(),
  contactInfo: z.string().optional(),
});
