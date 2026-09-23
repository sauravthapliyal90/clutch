import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../shared/error/ApiError.js';
import { RoleName } from '@shared/constants/roles.js';

export function authorize(allowedRoles: RoleName[]){
    return (req: Request, _res: Response, next: NextFunction): void => {
        if(!req.user) throw new UnauthorizedError();
        if(!allowedRoles.includes(req.user.role)) throw new ForbiddenError('Requested action is not allowed for your role');
        next();
    }
}

