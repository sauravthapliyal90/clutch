import { UnauthorizedError } from "@shared/error/ApiError";
import {Request, Response} from "express";
import { hostsService } from "./hosts.service";

export const hostsController = {
    async approve( req: Request, res: Response){
         if(!req.user) throw new UnauthorizedError();
         const hostProfile = await hostsService.approveHost(
            req.body.userId,
            req.user.id,
            req.body.contactInfo
         );
         res.status(201).json(hostProfile);
    },
    async list(req: Request, res: Response){
      res.json(await hostsService.listHosts(req.query as any))
    }
}