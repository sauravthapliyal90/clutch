import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/error/AppError.js";
import { logger } from "../config/logger.js";
import { env } from "../config/env.js";

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    if(err instanceof AppError){
        logger.error({err, path: req.path}, "Operational error");
        res.status(err.statusCode).json({
            error: err.message,
            details: err.details,
        });
        return;
    }

    logger.error({err, path: req.path}, "Unexpected error");
    res.status(500).json({
        error: env.NODE_ENV === "production" ? "Internal server error" : String(err),
    })    
}

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({error: `Router not found: ${req.method} ${req.path}`});
}

