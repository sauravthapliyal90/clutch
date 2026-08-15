import {Request, Response, NextFunction} from 'express';
import {verifyAccessToken} from '../utils/jwt.js';
import {UnauthorizedError} from '../shared/error/ApiError.js';
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
        req.user = {id: payload.sub, role: payload.role};
    }catch(err){
        throw new UnauthorizedError('Invalid or expired token');
    }
}

// For routes that behave differently for logged-in vs anonymous users but
// don't require auth (e.g. public meet listing that shows "you're
// registered" when authenticated).
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();

  try {
    const payload = verifyAccessToken(header.slice('Bearer '.length));
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // Invalid token on an optional route: treat as anonymous rather than erroring.
  }
  next();
}