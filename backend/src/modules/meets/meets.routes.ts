import { validate } from "@middleware/validate.middleware";
import { Router } from "express";
import { createMeetSchema, listMeetsQuerySchema, updateMeetSchema } from "./meets.validator";
import { authenticate, optionalAuthenticate } from "@middleware/auth.middleware";
import { authorize } from "@middleware/authorize.middleware";
import { ROLES } from "@shared/constants/roles";
import { ownsMeetOrIsAdmin } from "@middleware/ownsMeetOrIsAdmin.middleware";
import { meetsController } from "./meets.controller";

const router = Router();


router.get(
    '/',
    optionalAuthenticate,
    validate(listMeetsQuerySchema, "query"),
    meetsController.list,
);

router.get(
    '/:id',
    optionalAuthenticate,
    meetsController.detail,
);

router.get("/host/:hostId", 
    authenticate,
    authorize([ROLES.HOST]), 
    meetsController.hostMeets);

// host only creation
router.post(
    '/',
    authenticate,
    authorize([ROLES.HOST]),
    validate(createMeetSchema),
    meetsController.create,
);

// ownership gated mutation - a host should never manage another host event
router.patch(
    '/:id',
    authenticate,
    authorize([ROLES.HOST, ROLES.ADMIN]),
    ownsMeetOrIsAdmin,
    validate(updateMeetSchema),
    meetsController.update,
);

router.delete(
    "/:id",
    authenticate,
    authorize([ROLES.HOST, ROLES.ADMIN]),
    ownsMeetOrIsAdmin,
    meetsController.cancel,
);

router.get(
    '/:id/participants',
    authenticate,
    authorize([ROLES.HOST, ROLES.ADMIN]),
    ownsMeetOrIsAdmin,
    meetsController.participants,
);

export default router;
