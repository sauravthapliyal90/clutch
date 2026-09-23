import {Queue} from 'bullmq';
import {redis} from '../../../config/redis'
import { Enqueue } from 'twilio/lib/twiml/VoiceResponse';

// A dedicated queue for RC verification jobs. Decoupling car creation from
// the actual government-portal call means a slow or down external API
// never affects the car-creation endpoint's latency or uptime. The worker
// that processes this queue lives in src/jobs/rc-verification.job.ts.

export const rcVerificationQueueRaw = new Queue('rc-verification', {connection: redis});

export const rcVerificationQueue = {
    async enqueue(carId: string): Promise<void>{
        await rcVerificationQueueRaw.add('verify-car',
        {
            carId
        },
        {
            attempts: 3,
            backoff: {type: 'exponential', delay: 5000}
        }
    )
    }
}