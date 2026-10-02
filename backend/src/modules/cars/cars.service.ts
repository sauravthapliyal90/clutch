import { ConflictError, ForbiddenError, NotFoundError } from '@shared/error/ApiError';
import { carsRepository } from './cars.repository';
import { rcVerificationQueue } from './rc-verification/rcVerification.service';
import { uploadsProvider } from '@modules/uploads/uploads.provider';

export const carsService = {
    

    async registerCar(ownerId: string, name: string, model: string, color: string, rcNumber: string, imageKey?: string) {
        console.log("rcnumber",rcNumber)
        const existing = await carsRepository.findByRcNumber(rcNumber);
        if (existing) throw new ConflictError('This Rc number is already registered');

        // Returns immediately with status PENDING - verification happens async
        // via a background job so the government portal's latency/uptime never
        // becomes this endpoint's problem. See rc-verification/ sub-module.
        const car = await carsRepository.create(ownerId, model, color, rcNumber, name, imageKey);
        await rcVerificationQueue.enqueue(car.id);
        return car;
    },

    async listMyCars(ownerId: string){
        const cars = await carsRepository.findByOwner(ownerId);
        

       const carsWithImageUrl = await Promise.all(
        cars.map(async (car) => {
            let imageUrl = null;

            if (car.imageKey) {
                imageUrl =
                       await uploadsProvider.generatePresignedGetUrl(
                        car.imageKey
                    );
            }

            return {
                ...car,
                imageUrl,
            };
             })
    );

    return carsWithImageUrl;
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

      async deleteCar(carId: string, userId: string) {
    const car = await carsRepository.findCar(carId, userId);

    if (!car) {
      throw new Error("Car not found");
    }

    // Delete image from S3 first
    if (car.imageKey) {
      await uploadsProvider.deleteObject(car.imageKey);
    }

    // Delete DB record
    await carsRepository.deleteCar(carId);

    return {
      message: "Car deleted successfully",
    };
  },

}