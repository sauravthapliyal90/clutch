import { NotFoundError, UnauthorizedError } from "@shared/error/ApiError"
import { Request, Response } from 'express';
import {usersService} from './users.service'

export const usersController = {
    async me(req: Request, res: Response){
        if(!req.user) throw new UnauthorizedError(); 
        
        res.json(await usersService.getProfile(req.user.id)); 
    },
    async updateMe(req: Request, res: Response){
        if(!req.user) throw new UnauthorizedError();

         res.json(await usersService.updateUser(req.user.id, req.body));
    },
    async list(req: Request, res: Response){
        res.json(await usersService.listUsers(req.query as any))
    }
}