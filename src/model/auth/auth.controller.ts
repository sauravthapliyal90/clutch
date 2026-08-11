import { Request, Response } from "express"
import {authService} from './auth.services'

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
        const pendingProfileToken = header?.startsWith('Bearer') ? header.slice(7) : '';
        const token = await authService.completeProfile(pendingProfileToken, req.body.name, req.body.email);
        res.status(200).json(token);
    },
    async refresh(req: Request, res:Response){
        const token = await authService.refresh(req.body.refreshToken);
        res.status(200).json(token);
    },
    async adminLogin(req: Request, res: Response){
        const token = await authService.adminLogin(req.body.username, req.body.password);
        res.status(200).json(token);
    }
    
}