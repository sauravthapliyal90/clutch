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
        const meetId = getRouteParam(req.params, "id")
        const meet = await meetsService.updateMeet(meetId, req.body);
        res.json(meet)
    },

    async cancel(req: Request, res: Response){
        const meetId = getRouteParam(req.params, "id")
        const meet = await meetsService.cancelMeet(meetId);
        res.json(meet);
    },

    async list(req: Request, res: Response){
        res.json(await meetsService.listMeets(res.locals.query))
    },

    async participants(req: Request, res: Response){
        const id = getRouteParam(req.params, "id")
        res.json(await meetsService.listParticipants(id))
    }
}

