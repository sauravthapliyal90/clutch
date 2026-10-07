import Router from "express"
import { registrationController } from "./registration.controller"
import { authenticate } from "@middleware/auth.middleware";
import { authorize } from "@middleware/authorize.middleware";
import { ROLES } from "@shared/constants/roles";

const router = Router();

router.post<{ id: string }>(
    "/meets/:id/register",
    authenticate,
     authorize([ROLES.USER, ROLES.HOST]),
    registrationController.register)

// router.patch(
//     '/registrations/:id/cancel',
//     authenticate,
//     authorize([ROLES.USER, ROLES.HOST]),
//     registrationsController.cancel
// );

router.get(
    '/registrations/mine',
    authenticate,
    authorize([ROLES.USER, ROLES.HOST]),
    registrationController.listMine
);

export default router