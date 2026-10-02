import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { BadRequestError } from "../shared/error/ApiError";

type Target = "body" | "query" | "params";

export function validate(
  schema: z.ZodType,
  target: Target = "body"
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      throw new BadRequestError(
        "Validation failed",
        result.error.flatten().fieldErrors
      );
    }

    if (target === "query") {
      res.locals.query = result.data;
    } else {
      req[target] = result.data;
    }

    next();
  };
}










// import { Request, Response, NextFunction } from 'express';
// import { z } from 'zod';
// import { BadRequestError } from '../shared/error/ApiError';

// type Target = 'body' | 'query' | 'params';

// // Generic zod-schema validator applied at the route boundary - malformed
// // input never reaches the service layer, keeping "is this well-formed"
// // separate from "is this business action allowed".
// export function validate(schema: z.ZodType, target: Target = 'body') {
//   return (req: Request, res: Response, next: NextFunction): void => {
//     const result = schema.safeParse(req[target]);
//     if (!result.success) {
//       throw new BadRequestError('Validation failed', result.error.flatten().fieldErrors);
//     }
//     req[target] = result.data;
//     // res.locals[target] = result.data;
//     next();
//   };
// }
