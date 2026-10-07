import { BadRequestError, ConflictError, NotFoundError } from "@shared/error/ApiError";
import { registrationRepository } from "./registration.repository"
import { prisma } from "@config/db";
import { Prisma } from "generated/prisma/client";
import { emitEvent } from "@shared/events/eventBus";


export const registrationService = {
    async registration(userId: string, meetId: string) {
        return prisma.$transaction(
            async (tx: Prisma.TransactionClient) => {
                const meet = await registrationRepository.findMeetForUpdate(tx, meetId);
                if (!meet) throw new NotFoundError("Meet is not found");

                if (meet.status !== "UPCOMING") throw new BadRequestError("This meet is not open for register");

                if (new Date() > meet.registrationDeadline) {
                    throw new BadRequestError("Registartion Deadline passed")
                }

                const existed = await registrationRepository.findExisted(tx, meetId, userId)
                if (existed) throw new ConflictError("already registered");

                const activeCount = await registrationRepository.coutActiveRegistrations(tx, meetId)
                if (activeCount >= meet.maxParticipants) throw new BadRequestError("Meet is full");

                const car = await registrationRepository.fetchCarId(tx, userId);
                if (!car) throw new BadRequestError("User does not have a car registered");
                const { id: carId } = car;

                const registration = await registrationRepository.registerUser(tx, carId, userId, meetId);


                return registration

            }, { isolationLevel: "Serializable" }
        ).then((registration)=>{
            emitEvent('registration.created',{registrationId: registration.id})
            return registration
        })
    },
    async list(userId: string) {
        const registerData = await registrationRepository.fetchList(userId)
        return registerData
    }
}