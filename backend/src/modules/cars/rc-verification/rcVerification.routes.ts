import { authenticate } from "@middleware/auth.middleware";
import { authorize } from "@middleware/authorize.middleware";
import { ROLES } from "@shared/constants/roles";
import { Router } from "express";
import {rcVerificationController} from './rcVerification.controller'


const router = Router();

router.post(
    '/:id/verify',
    authenticate,
    authorize([ROLES.ADMIN]),
    rcVerificationController.triggerVerification
)

export default router;