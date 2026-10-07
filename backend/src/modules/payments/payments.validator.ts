import { z } from "zod";

export const createOrderSchema = z.object({
  plan: z.enum(["THREE_MONTH", "ONE_YEAR"]),
});

export const verifyPaymentSchema = z.object({
  razorpayPaymentId: z.string(),
  razorpayOrderId: z.string(),
  razorpaySignature: z.string(),
});