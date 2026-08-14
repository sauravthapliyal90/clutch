import {adminRepository} from './admin.repository'

async function getDashboardStats(){
    return adminRepository.dashboardStats();
}

export const adminService = {getDashboardStats};