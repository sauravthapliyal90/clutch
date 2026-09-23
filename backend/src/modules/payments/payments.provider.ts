import { env } from "@config/env";
import  crypto, { verify }  from "node:crypto";
import Razorpay from "razorpay";


const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET
})


export const razorpayProvider = {
    async createOrder(amountInPaise: number, currency: string, receipt: string){
        return razorpay.orders.create({amount: amountInPaise, currency, receipt})
    },

    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean{
        

        if (!env.RAZORPAY_KEY_SECRET) return false;

        const expected = crypto
            .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        return expected === signature;
    },
    verifyWebhookSignature(rawBody: string, signature: string):boolean{
      if(!env.RAZORPAY_KEY_SECRET) return false;
        const expected = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(rawBody)
      .digest("hex");
      return expected === signature;
    }
}