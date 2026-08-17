import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validate.middleware";
import { Router } from "express";
import { requestUploadUrlSchema } from "./uploads.validate";
import { uploadsController } from "./uploads.controller"

const router = Router();
console.log("yes")
router.post(
    "/request-url", 
    authenticate, 
    // validate(requestUploadUrlSchema),
    uploadsController.requestUploadUrl
);

export default router;