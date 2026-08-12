import { Router } from "express";
import authRoute from "../model/auth/auth.router"

const router = Router();
console.log("hii");

router.use("/auth", authRoute);

export default router