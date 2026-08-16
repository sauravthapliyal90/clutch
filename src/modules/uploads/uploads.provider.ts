import {S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@config/env";


const s3 = new S3Client({region: env.AWS_REGION})

export const uploadsProvider = {
    async generatePresignedPutUrl(key: string, contentType: string): Promise<string>{
        const command = new PutObjectCommand({
            Bucket: env.S3_BUCKET_NAME,
            Key: key,
            ContentType: contentType
        });
        return getSignedUrl(s3, command, { expiresIn: env.AWS_UPLOAD_URL_TTL_SECONDS})
    },

    buildPublicUrl(key: string): string{
        return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
    }
}