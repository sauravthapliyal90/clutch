import {Request, Response, NextFunction} from 'express';
import {verifyAccessToken} from '../utils/jwt.js';
import {UnauthorizedError} from '../shared/error/AppError.js';
import type {RoleName} from '../shared/constants/roles.js';

declare global{
    namespace Express {
        interface Request {
            user?: {id: string, role: RoleName};
        }
    }
}


export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    try{
        const payload = verifyAccessToken(token);
        req.user = {id: payload.userId, role: payload.role};
    }catch(err){
        throw new UnauthorizedError('Invalid or expired token');
    }
}