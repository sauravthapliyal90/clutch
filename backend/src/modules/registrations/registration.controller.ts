import { Request, Response } from "express";
import {registrationService} from "./registration.service"
import { UnauthorizedError } from "@shared/error/ApiError";

interface RegistrationParams {
    id: string;
}

export const registrationController = {
    async register(req: Request<RegistrationParams>, res: Response){

        if (!req.user) throw new UnauthorizedError();

        const result = await registrationService.registration( req.user.id, req.params?.id);

        res.status(200).json(result)
    },

    async listMine(req: Request, res: Response){
        if(!req.user) throw new UnauthorizedError();

        const data  = await registrationService.list(req.user.id)

        res.status(200).json(data)
    }
}