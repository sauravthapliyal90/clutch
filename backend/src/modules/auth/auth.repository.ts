import {prisma} from "../../config/db"
import { hashToken } from "@utils/jwt";

type RefreshTokenOwner = { userId: string } | { adminId: string };

export const authRepository = {
    findUserByPhone(phone: string) {
        return prisma.user.findUnique({
            where: {phone}, 
            include: { hostProfile: true }
        })
    },
    createUser(phone: string){
        return prisma.user.create({data: {phone}});
    },
    completeProfile(userId: string, name: string, email: string){
        return prisma.user.update({
            where: {id: userId} , 
            data: {name, email, isProfileComplete: true}
        })
    },
    storeRefreshToken(owner: RefreshTokenOwner, refreshToken: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { ...owner, tokenHash: hashToken(refreshToken), expiresAt },
    });
  },
    findAdminByUsername(username: string){
        return prisma.admin.findUnique({where: {username}})
    },
    findRefreshToken(refreshToken: string){
        return prisma.refreshToken.findUnique({
            where:{tokenHash: hashToken(refreshToken)}
        })
    },
    revokedRefreshToken(id: string){
        return prisma.refreshToken.update({
            where: {id}, data: {revoked: true}
        });
    }
}   
