import { storeOtp, canRequestOtp, verifyOtp } from "@shared/otp/otpStore";
import { generateOtp } from "@utils/otp"
import { BadRequestError, TooManyRequestsError, UnauthorizedError } from "@shared/error/ApiError";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@utils/jwt";
import { authRepository } from "./auth.repository";
import { env } from "@config/env";
import jwt from "jsonwebtoken";
import { verifyPassword } from "@utils/hash";
import { ROLES } from '../../shared/constants/roles';
import { logger } from "@config/logger";
import { smsProvider } from "@modules/notifications/sms.provider";



async function requestOtp(phone: string) {
   const allowed = await canRequestOtp(phone);
   if (!allowed) {
      throw new TooManyRequestsError("Please wait before requesting another code");
   }
   const otp = generateOtp();
   await storeOtp(phone, otp);
   console.log("otp", otp)
   const otpMessage = `Your CarMeet verification code is ${otp}. Valid for 5 minutes.`
   //  await smsProvider.send(phone, otp)
}



async function verifyOtpAndLogin(phone: string, otp: string) {
   // phone -> cooldown if no
   // otp ->  redis if yes
   // token create 
   // user -> token, login
   // const otpPresent = await verifyOtp(phone, otp)
   const otpPresent = verifyOtp(phone, otp);
   if (!otpPresent) throw new BadRequestError("Invalid Otp");

   let user = await authRepository.findUserByPhone(phone);

  //  console.log("user.....",user)
   if (!user) {
      const newUser = await authRepository.createUser(phone);

      const pendingProfileToken = jwt.sign({ sub: newUser.id, purpose: 'complete-profile' },
         env.JWT_ACCESS_SECRET as string,
         { expiresIn: '10m' })

      return { status: 'PROFILE_INCOMPLETE' as const, pendingProfileToken }
   }

   if (!user.isProfileComplete) {
      const pendingProfileToken = jwt.sign(
         { sub: user.id, purpose: 'complete-profile' },
         env.JWT_ACCESS_SECRET as string,
         { expiresIn: '10m' }
      );
      return { status: 'PROFILE_INCOMPLETE' as const, pendingProfileToken };
   }
  // console.log("yaha ponch gya")
   return {
      status: 'LOGGED_IN',
      tokens: await issueTokenPair(user.id, user.role)
   }

}


async function completeProfile(pendingProfileToken: string, name: string, email: string) {
   let payload: { sub: string; purpose: string }
   try {
      payload = jwt.verify(pendingProfileToken, env.JWT_ACCESS_SECRET as string) as any;

   } catch (error) {
      throw new UnauthorizedError('Invalid or expired pending profile token');
   }

   if (payload.purpose !== 'complete-profile') throw new UnauthorizedError();

   const user = await authRepository.completeProfile(payload.sub, name, email);
   return issueTokenPair(user.id, user.role);

}

async function adminLogin(username: string, password: string) {
   
   const admin = await authRepository.findAdminByUsername(username);
   logger.info(`admin ${admin?.passwordHash} password ${password}`)
   if (!admin) throw new UnauthorizedError('Invalid credentails')

   const valid = await verifyPassword( password, admin.passwordHash)
   logger.info(`valid ${valid}`);
   if (!valid) throw new UnauthorizedError('Invalid credentails')
      
   const token = await issueTokenPair(admin.id, ROLES.ADMIN)
  //  console.log("token", token);
   
   return [token , {name:admin.username, role:"Admin"}]
}

async function issueTokenPair(ownerId: string, role: string) {
  const accessToken = generateAccessToken({ sub: ownerId, role: role as any });
  const refreshToken = generateRefreshToken({ sub: ownerId, role: role as any });

  const decoded = jwt.decode(refreshToken) as { exp: number };
  const expiresAt = new Date(decoded.exp * 1000);

  const owner = role === ROLES.ADMIN ? { adminId: ownerId } : { userId: ownerId };
  await authRepository.storeRefreshToken(owner, refreshToken, expiresAt);

  return { accessToken, refreshToken };
}
async function refresh(refreshToken: string) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError(
      "Invalid or expired refresh token"
    );
  }

  const stored =
    await authRepository.findRefreshToken(refreshToken);

  if (!stored) {
    throw new UnauthorizedError(
      "Refresh token not found"
    );
  }

  if (stored.revoked) {
    throw new UnauthorizedError(
      "Refresh token already revoked"
    );
  }

  const revoked =
    await authRepository.revokedRefreshToken(stored.id);

  // Another request may have revoked it first
  if (!revoked || revoked.revoked !== true) {
    throw new UnauthorizedError(
      "Refresh token already used"
    );
  }
  console.log("Revoked----->", revoked);
  
  return await  issueTokenPair(
    payload.sub,
    payload.role
  );
}

export const authService = {
   verifyOtpAndLogin,
   requestOtp,
   adminLogin,
   completeProfile,
   refresh
}