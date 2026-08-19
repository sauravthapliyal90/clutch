import { ConflictError, ForbiddenError, NotFoundError } from '@shared/error/ApiError';
import { carsRepository } from './cars.repository';
import { NotBeforeError } from 'jsonwebtoken';
import { notFoundHandler } from '@middleware/errorHandler.middleware';


export const carsService = {

    async registerCar(ownerId: string, model: string, color: string, rcNumber: string) {
        const existing = await carsRepository.findByRcNumber(rcNumber);
        if (existing) throw new ConflictError('This Rc number is already registered');

        // Returns immediately with status PENDING - verification happens async
        // via a background job so the government portal's latency/uptime never
        // becomes this endpoint's problem. See rc-verification/ sub-module.
        const car = await carsRepository.create(ownerId, model, color, rcNumber);
        await rcVerficationQueue.enqueue(car.id);
        return car;
    },

    async listMyCars(ownerId: string){
        return carsRepository.findByOwner(ownerId);
    },

    async getCarOrThrow(carId: string){
        const car = await carsRepository.findById(carId);
        if(!car) throw new NotFoundError('Car not found');
        return car;
    },

    async assertOwnership(carId: string, userId: string){
        const car = await this.getCarOrThrow(carId);
        if(car.ownerId !== userId) throw new ForbiddenError('You do not own this car');
        return car;
    },

}