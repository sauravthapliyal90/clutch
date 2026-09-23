import { prisma } from "@config/db";

export const hostsRepository = {
      findByUserId(userId: string){
        return prisma.hostProfile.findUnique({where: {userId}})
      },
      createHostProfile(userId: string, approvedBy: string, contactInfo?: string){
           return prisma.$transaction([
            prisma.user.update({where: {id: userId}, data:{role:'HOST'}}),
            prisma.hostProfile.create({
                data:{userId,approvedBy, approvedAt: new Date(), contactInfo}
            })
           ])
      },
      listAll(skip:number, take: number){
        return Promise.all([
            prisma.hostProfile.findMany({ skip, take, include: {user: true}}),
            prisma.hostProfile.count()
        ])
      }
}