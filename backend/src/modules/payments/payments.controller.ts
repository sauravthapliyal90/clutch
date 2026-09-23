import { UnauthorizedError } from "@shared/error/ApiError"
import { Request, Response } from "express"
import {paymentsService} from './payments.service'

export const paymentsController = {
    async createOrder(req: Request, res: Response){
       if(!req.user) return new UnauthorizedError("User is not found");
       const { plan } = req.body;
       const result = await paymentsService.createOrder(req.user.id, plan)
       res.status(201).json(result);
    },
    async verifyPayment(req: Request, res: Response){
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const result = await paymentsService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        res.status(200).json(result);
    },
    async webhook(req: Request, res: Response){
        const signature = req.headers['x-razorpay-signature'] as string;
        const result = await paymentsService.handleWebhook(req.body, signature);
    }
}