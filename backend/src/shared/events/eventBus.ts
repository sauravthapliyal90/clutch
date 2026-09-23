import { EventEmitter } from 'node:events';

// In-process event bus for today. When a module (e.g. notifications,
// payments) needs to become an independent service, this is the seam:
// swap the emitter underneath for Kafka/RabbitMQ/SQS without changing
// the modules that call emitEvent/onEvent.
export const eventBus = new EventEmitter();

export type DomainEvent =
  | 'car.verified'
  | 'car.verification.failed'
  | 'registration.created'
  | 'registration.cancelled'
  | 'subscription.expired'
  | 'payment.succeeded'
  | 'payment.failed';

export function emitEvent<T = unknown>(event: DomainEvent, payload: T): void {
  eventBus.emit(event, payload);
}

export function onEvent<T = unknown>(event: DomainEvent, handler: (payload: T) => void): void {
  eventBus.on(event, handler);
}
