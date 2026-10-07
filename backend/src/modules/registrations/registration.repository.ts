import { prisma } from "@config/db"
import { Prisma } from "generated/prisma/client"



export const registrationRepository = {
    fetchCarId(tx: Prisma.TransactionClient, userId: string) {
        return tx.car.findFirst({ where: { ownerId: userId } })
    },

    registerUser(tx: Prisma.TransactionClient, carId: string, userId: string, meetId: string) {
        return tx.registration.create({ data: { carId, userId, meetId } })
    },

    fetchList(userId: string) {
        return prisma.registration.findFirst({where: {userId}})
    },
    findMeetForUpdate(tx: Prisma.TransactionClient, meetId: string) { 
        return tx.meet.findUnique({where: {id: meetId}})
    },
    findExisted(tx: Prisma.TransactionClient, meetId: string, userId: string){
        return tx.registration.findUnique({where: {meetId_userId: {userId, meetId}}})
    },
    coutActiveRegistrations(tx: Prisma.TransactionClient, meetId: string){
        return tx.registration.count({where: {meetId, status:"REGISTERED"}})
    }
}