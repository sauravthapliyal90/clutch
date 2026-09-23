import { UnauthorizedError } from "@shared/error/ApiError";
import { Request, Response } from "express";
import {uploadsService} from "./uploads.service"


export const uploadsController = {
    async requestUploadUrl(req: Request, res: Response){
        if(!req.user) throw new UnauthorizedError();
        const { contentType, context } = req.body;
        const result = await uploadsService.requestUploadUrl(context, contentType, req.user.id);
        res.status(200).json(result);
    }
}