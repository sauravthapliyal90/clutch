import { Router } from "express";
import {adminController} from "./admin.controller";
import { authenticate } from "@middleware/auth.middleware";
import { authorize } from "@middleware/authorize.middleware";
import { ROLES } from "@shared/constants/roles";


const router = Router();

router.get('/dashboard/stats', authenticate, authorize([ROLES.ADMIN]),adminController.dashboard);

export default router;