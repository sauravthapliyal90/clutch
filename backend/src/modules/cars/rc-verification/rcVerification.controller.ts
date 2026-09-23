import { Request, Response } from "express";
import {carsRepository }  from '../cars.repository';
import {rcVerificationQueue} from './rcVerification.service';
import { NotFoundError } from "@shared/error/ApiError";


export const rcVerificationController = {
      // Admin can force a re-check (spec: "Admin can verify cars if needed").
      async triggerVerification(req: Request, res: Response){
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const car = await carsRepository.findById(id);
        if(!car) throw new NotFoundError("Car not Found");

        await carsRepository.updateVerificationStatus(car.id, 'PENDING');
        await rcVerificationQueue.enqueue(car.id);
        res.status(202).json({message: 'Verification re-queued'});
      }
}