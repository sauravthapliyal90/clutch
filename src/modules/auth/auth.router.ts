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

router.post('/otp/request', otpRequestRateLimiter, validate(requestOtpSchema), authController.requestOtp);

router.post('/otp/verify', validate(verifyOtpSchema), authController.verifyOtp);

router.post('/complete-profile', validate(completeProfileSchema), authController.completeProfile);

router.post('/refresh', validate(refreshSchema), authController.refresh);

// Admin-only: separate credential type, separate table, never otp
router.post('/admin/login', validate(adminLoginSchema), authController.adminLogin);

export default router;