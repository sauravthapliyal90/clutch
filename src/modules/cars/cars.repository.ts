import { prisma } from "@config/db"
import { VerificationStatus } from "generated/prisma/enums";


export const carRepository = {

    create(ownerId: string, model: string, color: string, rcNumber: string){
        return prisma.car.create({data: {ownerId, model, color, rcNumber}})
    },

    findById(id: string){
        return prisma.car.findUnique({where: {id}});
    },

    findByOwner(ownerId: string){
        return prisma.car.findMany({where: {ownerId}, orderBy: {createdAt: 'desc'}})
    },

    findByRcNumber(rcNumber: string){
        return prisma.car.findUnique({where: {rcNumber}});
    },

    updateVerificationStatus(id: string, status: VerificationStatus){
        return prisma.car.update({
            where: {id},
            data: {verificationStatus: status, verifiedAt:status == 'VERIFIED' ? new Date() : null}
        })
    },

    findPendingVerification(take: number){
        return prisma.car.findMany({ where: {verificationStatus: 'PENDING'}, take})
    },
}