import { Request, Response } from "express";
import { meetsService } from "./meets.service"
import { UnauthorizedError } from "@shared/error/ApiError";
import { getRouteParam } from "@utils/getRouteParams";


export const meetsController = {
    async create(req: Request, res: Response) {
        if (!req.user) throw new UnauthorizedError("user not found");
        console.log("req.body",req.body);
        
        const meet = await meetsService.createMeet(req.user.id, req.body);

        res.status(200).json(meet);
    },

    async update(req: Request, res: Response) {
        console.log("i am here");
        
        const meetId = getRouteParam(req.params, "id")
        const meet = await meetsService.updateMeet(meetId, req.body);
        res.status(200).json(meet)
    },

    async cancel(req: Request, res: Response){
        console.log("inside cancel controller");
        
        const meetId = getRouteParam(req.params, "id")
        console.log("meetId =======> ",meetId);
        
        const meet = await meetsService.cancelMeet(meetId);
        console.log("meet",meet);
        
        res.status(200).json(meet);
    },

    async list(req: Request, res: Response){
        res.status(200).json(await meetsService.listMeets(res.locals.query))
    },

    async participants(req: Request, res: Response){
        const id = getRouteParam(req.params, "id")
        res.status(200).json(await meetsService.listParticipants(id))
    },
    async detail(req: Request, res: Response){
         const meetId = getRouteParam(req.params,"id")
         res.status(200).json(await meetsService.getMeetDetail(meetId))
    },

    async hostMeets(req: Request, res: Response){
        const hostId = getRouteParam(req.params, "hostId");
        console.log("hostId in controller------>", hostId);
        res.status(200).json(await meetsService.listHostMeets(hostId));
    }
}

