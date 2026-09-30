import { Request, Response } from "express"
import {authService} from './auth.services'
import { logger } from "@config/logger";

export const authController = {
    async requestOtp(req: Request, res: Response) {
        const phoneNumber = req.body.phone;
        await authService.requestOtp(phoneNumber);
        res.status(200).json({message: 'OTP sent'})
    },
    async verifyOtp(req: Request, res: Response){
        const {phone, otp} = req.body;
        const result = await authService.verifyOtpAndLogin(phone, otp);
        res.status(200).json(result);
    }, 
    async completeProfile(req: Request, res: Response){
        const header = req.headers.authorization;
        logger.info(`header ${header}`);
        const pendingProfileToken = header?.startsWith('Bearer') ? header.slice(7) : '';
        logger.info(`pendingProfileToken "${pendingProfileToken}"`);
        const token = await authService.completeProfile(pendingProfileToken, req.body.name, req.body.email);
        res.status(200).json(token);
    },
    async refresh(req: Request, res:Response){
        const token = await authService.refresh(req.body.refreshToken);
         console.log("token controller of admin log --------->>>>>>",token);
        res.status(200).json(token);
    },
    async adminLogin(req: Request, res: Response){
        const data = await authService.adminLogin(req.body.username, req.body.password);
        console.log("data of admin controller log --------->>>>>>",data);
        
        res.status(200).json(data);
    }
    
}