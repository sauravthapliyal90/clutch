import { Worker } from "bullmq";
import { redis } from "@config/redis";
import { carsRepository } from "@modules/cars/cars.repository";
import {emitEvent} from '../shared/events/eventBus';
import { logger } from '../config/logger';



const rcVerificationWorker = new Worker('rc-verification',async (job) => {
    const {carId} = job.data as {carId:string}
    const car = await carsRepository.findById(carId);
    if(!car) return;

    const result = await rcVerificationProvider.verify(car.rcNumber);
    const status = result.verified ? 'VERIFIED' : 'FAILED';
    await carsRepository.updateVerificationStatus(carId,status);

      emitEvent(status === 'VERIFIED' ? 'car.verified' : 'car.verification.failed', { carId });
},
{connection: redis}
)

rcVerificationWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'RC verification job failed');
});
