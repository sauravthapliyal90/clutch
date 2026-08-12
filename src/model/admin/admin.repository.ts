import { prisma } from "@config/db"

export const adminRepository = {
    async dashboardStats(){
        const [totalUsers, totalHost, totalMeets, upcomingMeets, totalRegistrations, activeSubscriptions] = 
        await Promise.all([
            prisma.user.count({where: {role: "USER"}}),
            prisma.hostProfile.count(),
            prisma.meet.count(),
            prisma.meet.count({where: {status: 'UPCOMING'}}),
            prisma.registration.count({where: {status: 'REGISTRATERED'}}),
            prisma.subscription.count({where: {status: 'ACTIVE'}})
        ]);

        return {totalUsers, totalHost, totalMeets, upcomingMeets, totalRegistrations, activeSubscriptions};
    }
}