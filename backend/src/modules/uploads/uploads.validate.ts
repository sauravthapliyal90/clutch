import { z } from "zod";
import { ALLOWED_CONTENT_TYPES } from "./uploads.types";

export const requestUploadUrlSchema = z.object({
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
  context: z.enum(["meet-banner", "meet-gallery", "car", "profile"]),
});