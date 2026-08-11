import jwt, {
  JwtPayload,
  Secret,
  SignOptions,
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";
import crypto from "node:crypto";
import { Role } from "../generated/prisma/enums.js";
import { env } from "../config/env.js";

export interface TokenPayload {
  sub: string;
  role: Role;
}


const accessTokenOptions: SignOptions = {
  expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
};
const refreshTokenOptions: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
};

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, accessTokenOptions);
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshTokenOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
}

export function decodeToken(token: string): JwtPayload | null {
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === "string") {
    return null;
  }
  return decoded;
}

// Refresh tokens are stored server-side (e.g. in a RefreshToken table) as a
// hash, never the raw value - same reasoning as password hashing. If the DB
// leaks, an attacker gets hashes they can't turn back into usable tokens.
// To validate or revoke a specific session later: hash the incoming token
// again and look it up by that hash - never store or compare plaintext.
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export { TokenExpiredError, JsonWebTokenError };