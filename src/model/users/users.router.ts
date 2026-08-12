import { Router } from "express";
import { authenticate } from "@middleware/auth.middleware";
import {usersController} from './users.controller'
import { validate } from "@middleware/validate.middleware";
import { updateProfileSchema } from "./users.validator";
import { authorize } from "@middleware/authorize.middleware";
import { paginationSchema } from "@shared/pagination/pagination";
import { ROLES } from "@shared/constants/roles";

const router = Router();

router.get('/me', authenticate, usersController.me);

router.patch('/me', authenticate, validate(updateProfileSchema), usersController.updateMe);

//admin-only listing - admin can manage users

router.get(
    '/', 
    authenticate, 
    authorize([ROLES.ADMIN]), 
    validate(paginationSchema, 'query'), 
    usersController.list);

    export default router;
