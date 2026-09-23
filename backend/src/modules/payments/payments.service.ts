import { env } from "@config/env";
import { razorpayProvider } from "./payments.provider";
import { BadRequestError } from "@shared/error/ApiError";
import { paymentsRepository } from "./payments.repository";



export const paymentsService = {
    
    async createOrder(userId: string, plan: "THREE_MONTH" | "ONE_YEAR"){
        const amount = paymentsRepository.planAmount(plan);
        const order = await razorpayProvider.createOrder(amount, "INR", `receipt_${Date.now()}`);

        const subscription = await paymentsRepository.createPendingSubscriptionWithPayment(
            userId,
            plan,
            order.id
        )
        
        return {orderId: order.id, amount, currency: "INR", keyId: env.RAZORPAY_KEY_ID, subscription}
    },

    async verifyPayment(orderId: string, paymentId: string, signature: string){
        const isValid = razorpayProvider.verifyPaymentSignature(orderId, paymentId, signature);
        if(!isValid) throw new BadRequestError("Payment verification fail")

        await paymentsRepository.markPaymentSuccess(orderId,"", paymentId);
        return{ verified: true};    
    },

    async handleWebhook(rawBody: string, signature: string){
        const isValid = razorpayProvider.verifyWebhookSignature(rawBody, signature);
        if(!isValid) throw new BadRequestError("Invalid webhook signature");

        const payload = JSON.parse(rawBody);
        const event = payload.event;
        const paymentEntity = payload.payload?.payment?.entity;

        if(event === "payment.captured" && paymentEntity){
            await paymentsRepository.markPaymentSuccess(paymentEntity.order_id, "", paymentEntity.id)
        };
        return {recieve: true}
    }
}; 