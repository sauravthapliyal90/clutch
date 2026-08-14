import { prisma } from "@config/db"
import { UpdateProfileInput } from "./users.type"


export const usersRepository = {
    findById(id: string){
       return prisma.user.findUnique({where: {id}, include: { hostProfile: true }})
    },
    update(id: string, input: UpdateProfileInput){
        return prisma.user.update({where: {id}, data: input })
    },
    async getAllUsers(skip: number, take: number){
      return Promise.all([
        prisma.user.findMany({skip, take, orderBy:{
            createdAt: 'desc'
        }}),
        prisma.user.count()
      ])
    }
}