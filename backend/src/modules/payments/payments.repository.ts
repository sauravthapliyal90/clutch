import { prisma } from "@config/db";

const PLAN_AMOUNTS_INR = { THREE_MONTH: 49900, ONE_YEAR: 149900};

export const paymentsRepository = {

    planAmount(plan: "THREE_MONTH" | "ONE_YEAR"){
        return PLAN_AMOUNTS_INR[plan];
    },

    createPendingSubscriptionWithPayment(userId: string, plan: "THREE_MONTH" | "ONE_YEAR",orderId: string){
        const startDate = new Date();
        const endDate= new Date(startDate);
        endDate.setDate(endDate.getDate()+(plan === "ONE_YEAR" ? 365: 90));

        return prisma.subscription.create({
            data: {
                userId,
                plan,
                startDate,
                endDate,
                status: "ACTIVE",
                payment:{
                    create: {
                        amount: PLAN_AMOUNTS_INR[plan]/100,
                        currency: "INR",
                        provider: "razorpay",
                        providerPaymentID: orderId,
                        status: "PENDING"
                    },
                },
            },
         include: {
            payments: true
         }
        })
    },

    markPaymentSuccess(providerPaymentId: string, subscriptionId: string, realPaymentId: string){
        return prisma.$transaction([
            prisma.payment.updateMany({
                where:{providerPaymentId, subscriptionId},
                data: {status: "SUCCESS", paidAt: new Date(), providerPaymentID: realPaymentId}
            })
        ])
}
}