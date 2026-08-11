import { Router } from 'express';
import { authController } from './auth.controller';
import { otpRequestRateLimiter } from '../../middleware/rateLimiter.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  requestOtpSchema,
  verifyOtpSchema,
  completeProfileSchema,
  adminLoginSchema,
  refreshSchema,
} from './auth.validator';


const router = Router();

router.post('/otp/request', otpRequestRateLimiter, validate(requestOtpSchema));

router.post('/otp/verify', validate(verifyOtpSchema));

router.post('/complete-profile', validate(completeProfileSchema));

router.post('/refresh', validate(refreshSchema));

// Admin-only: separate credential type, separate table, never otp
router.post('/admin/login', validate(adminLoginSchema));

export default router;