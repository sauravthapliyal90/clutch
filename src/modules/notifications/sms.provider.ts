import twilio from "twilio";
import { env } from "@config/env";
import { logger } from "@config/logger";

const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

export const smsProvider = {
    async send(phone: string, otp: string): Promise<void> {
        try {
            // swap smsProvider.send(...) for this
            await client.verify.v2
                .services(env.TWILIO_ACCOUNT_SID)
                .verifications.create({ to: phone, channel: "sms" });

            // and for checking the code the user typed:
            const check = await client.verify.v2
                .services(env.TWILIO_ACCOUNT_SID)
                .verificationChecks.create({ to: phone, code: otp });

            const isValid = check.status === "approved";
        } catch (err) {
            const twilioErr = err as { code?: number; message?: string; moreInfo?: string; status?: number };
            logger.error(
                { code: twilioErr.code, message: twilioErr.message, moreInfo: twilioErr.moreInfo },
                "Failed to send SMS via Twilio"
            );
            throw err;

        }
    }
}