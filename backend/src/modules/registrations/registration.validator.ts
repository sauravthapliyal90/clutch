import { z } from 'zod';

export const createRegistrationSchema = z.object({
  carId: z.string().uuid().optional(),
});
