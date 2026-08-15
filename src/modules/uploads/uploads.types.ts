// The "context" tells us where in S3 this file belongs and constrains
// what it's allowed to be used for later - not strictly enforced yet,
// but keeps key naming organized and gives you a hook for per-context
// rules later (e.g. different size limits for banners vs. profile photos).
export type UploadContext = "meet-banner" | "meet-gallery" | "car" | "profile";

export const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];