import { z } from "zod";

export const createOrderSchema = z.object({
  plan: z.enum(["THREE_MONTH", "ONE_YEAR"]),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});