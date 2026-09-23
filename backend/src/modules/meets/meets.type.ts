import type {z} from 'zod';
import type {createMeetSchema} from './meets.validator';

export type CreatemeetInput = z.infer<typeof createMeetSchema>;