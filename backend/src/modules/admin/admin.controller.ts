import { Request, Response } from "express"
import { adminService } from "./admin.service"

export const adminController = {
    async dashboard(_req:Request, res: Response){
      console.log("dashboard")
      const data = await adminService.getDashboardStats()
      res.json(data)
    }
}