import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validate.middleware";
import { Router } from "express";
import { createCarSchema } from "./cars.validator";
import rcVerificationRoutes from './rc-verification/rcVerification.routes';
import { carsController } from './cars.controller';

const router = Router();

router.post(
    '/', 
    authenticate, 
    validate(createCarSchema),
    carsController.create
);

router.get(
    '/mine',
    authenticate, 
    carsController.listMine
);

// Admin-triggered re-verification / manual override lives in the sub-module.
router.use('/', rcVerificationRoutes);

export default router;