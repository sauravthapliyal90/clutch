import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validate.middleware";
import { raw, Router } from "express";
import { createOrderSchema, verifyPaymentSchema } from "./payments.validator";
import {paymentsController} from './payments.controller'


const router = Router();

router.post('/createOrder', authenticate, validate(createOrderSchema), paymentsController.createOrder)

router.post('/verify', authenticate, validate(verifyPaymentSchema), paymentsController.verifyPayment);

router.post('/webhook', raw({type:"*/*"}), paymentsController.webhook)

export default router;