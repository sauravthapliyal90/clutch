import { env } from "@config/env";
import { logger } from "@config/logger";

export interface RcVerificationResult {
    verified: boolean;
    rawResponse?: unknown;
}

export const rcVerificationProvider = {
    async verify(rcNumber: string): Promise<RcVerificationResult> {
        if (!env.RC_VERIFICATION_API_KEY) {
            logger.warn('RC_VERIFICATION_API_URL not configured - stub always verifies');
            return { verified: true }
        }


        const res = await fetch(env.RC_VERIFICATION_API_KEY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${env.RC_VERIFICATION_API_KEY}`
            },
            body: JSON.stringify({ rcNumber }),
        })
        if (!res.ok) {
            throw new Error(`RC verification portal returned ${res.status}`);
        }

        const data = (await res.json()) as { verified?: boolean };
        return { verified: Boolean(data.verified), rawResponse: data };
    }


}