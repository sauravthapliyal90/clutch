import { z } from 'zod';

export const createMeetSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10),
  // bannerImageUrl: z.string().url(),
  // galleryImageUrls: z.array(z.string().url()).default([]),
  location: z.string().min(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  date: z.coerce.date(),
  registrationDeadline: z.coerce.date(),
  maxParticipants: z.number().int().min(1),
  requiresVerifiedCar: z.boolean().default(false),
  bannerImageKey: z.string(),
  meetType: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
});

export const updateMeetSchema = createMeetSchema.partial();

export const listMeetsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(6),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
});
