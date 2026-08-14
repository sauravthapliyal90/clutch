import { Request, Response } from "express"
import { adminService } from "./admin.service"

export const adminController = {
    async dashboard(_req:Request, res: Response){
      res.json(await adminService.getDashboardStats())
    }
}