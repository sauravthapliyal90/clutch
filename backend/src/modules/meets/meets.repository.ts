import { prisma } from "@config/db";
import { CreatemeetInput } from "./meets.type";


export const meetsRepository = {
    findByUserId(userId: string) {
        return prisma.hostProfile.findUnique({ where: { userId } });
    },

    create(hostProfileId: string, input: CreatemeetInput){
        return prisma.meet.create({data: {...input, hostId: hostProfileId}})
    },

    findById(id: string){
        return prisma.meet.findUnique({
            where: {id},
            include: {
                host: { include: { user: true } },
                _count: { select: { registrations: true } }
            }
        })
    },

    update(id: string, data: Partial<CreatemeetInput>) {
        return prisma.meet.update({ where: {id}, data});
    },

    softCancel(id: string){
        return prisma.meet.update({ where: {id}, data: {
            status: 'CANCELLED'
        }})
    },

    listPublic(skip: number, take: number, status?: string){
        return Promise.all([
            prisma.meet.findMany({
                where:{ status: { not:"CANCELLED"}},
                skip,
                take,
                orderBy: {date: 'asc'},
                include: { _count: {select: {registrations: true}}}
            }),
            prisma.meet.count({where: status ? { status: status as any}: undefined})
            
        ])
    },

    listParticipants(meetId: string){
     return prisma.registration.findMany({
        where: {meetId},
        include: {user: true, car: true},
        orderBy: {registeredAt: 'asc'}
     })
    },

    listHostMeets(hostId: string){
        return prisma.hostProfile.findMany({
            where: {userId: hostId},
            include: {
                meets: {
                    orderBy: {date: 'asc'},
                    include: { _count: {select: {registrations: true}}}
                }
            }
        })
    }
}