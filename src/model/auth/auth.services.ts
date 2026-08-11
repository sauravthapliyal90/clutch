import { storeOtp, canRequestOtp, verifyOtp } from "@shared/otp/otpStore";
import { generateOtp } from "@utils/otp"
import { BadRequestError, TooManyRequestsError, UnauthorizedError } from "@shared/error/AppError";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@utils/jwt";
import { authRepository } from "./auth.repository";
import { env } from "@config/env";
import jwt from "jsonwebtoken";
import { verifyPassword } from "@utils/hash";
import { ROLES } from '../../shared/constants/roles';



async function requestOtp(phone: string) {
   const allowed = await canRequestOtp(phone);
   if (!allowed) {
      throw new TooManyRequestsError("Please wait before requesting another code");
   }
   const otp = generateOtp();
   await storeOtp(phone, otp);
   //  await notificationService.sendOtpSms(phone, otp)
}



async function verifyOtpAndLogin(phone: string, otp: string) {
   // phone -> cooldown if no
   // otp ->  redis if yes
   // token create 
   // user -> token, login
   const otpPresent = await verifyOtp(phone, otp)
   if (!otpPresent) throw new BadRequestError("Invalid Otp");

   let user = await authRepository.findUserByPhone(phone);

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

   return {
      status: 'LOGGED_IN' as const,
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
   if (!admin) throw new UnauthorizedError('Invalid credentails')

   const valid = verifyPassword(admin.passwordHash, password)
   if (!valid) throw new UnauthorizedError('Invalid credentails')

   return issueTokenPair(admin.id, ROLES.ADMIN)
}

async function issueTokenPair(userId: string, role: string) {
   const accessToken = generateAccessToken({ sub: userId, role: role as any })
   const refreshToken = generateRefreshToken({ sub: userId, role: role as any })

   const decoded = jwt.decode(refreshToken) as { exp: number };
   await authRepository.storeRefreshtoken(userId, refreshToken, new Date(decoded.exp * 1000))

   return { accessToken, refreshToken }
}

async function refresh(refreshToken: string){
   let payload;
   try {
      payload = verifyRefreshToken(refreshToken); 
   } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
   }

   const stored = await authRepository.findRefreshToken(refreshToken);
   
   if(!stored || stored.revoked) throw new UnauthorizedError('Refresh token revoked')

   await authRepository.revokedRefreshToken(stored.id);
   return issueTokenPair(payload.sub, payload.role);
}

export const authService = {
   verifyOtpAndLogin,
   requestOtp,
   adminLogin,
   completeProfile,
   refresh
}