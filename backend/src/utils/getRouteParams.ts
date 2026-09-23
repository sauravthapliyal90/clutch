// utils/getRouteParam.ts
import { BadRequestError } from "@shared/error/ApiError.js";

export function getRouteParam(params: Record<string, string | string[]>, key: string): string {
  const value = params[key];
  if (typeof value !== "string") throw new BadRequestError(`Invalid or missing route param: ${key}`);
  return value;
}