import { Request, Response } from "express";
import { carsService } from './cars.service'
import { UnauthorizedError } from "@shared/error/ApiError";


export const carsController = {
    
    async create(req: Request, res: Response){
        if(!req.user) throw new UnauthorizedError();
        const {model, color, rcNumber, name, imageKey} = req.body;
        console.log("controller rcNumber", rcNumber);
        
        const car = await carsService.registerCar(req.user.id,name, model, color, rcNumber,imageKey);
        res.status(201).json(car);
    },

    async listMine(req: Request, res: Response){
        if (!req.user) throw new UnauthorizedError("user not found");
        res.json(await carsService.listMyCars(req.user.id));        
        
    },
  async deleteCar(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const id = String(req.params.id);

    const result = await carsService.deleteCar(
      id,
      req.user.id
    );

    res.status(200).json(result);
  },
}