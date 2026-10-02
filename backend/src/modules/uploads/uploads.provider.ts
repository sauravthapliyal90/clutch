import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@config/env";


const AWS_DOWNLOAD_URL_TTL_SECONDS = 1500;
const s3 = new S3Client({
  region: env.AWS_REGION
  , credentials:
  {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  }
})

export const uploadsProvider = {
  async generatePresignedPutUrl(
    key: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(s3, command, {
      expiresIn: env.AWS_UPLOAD_URL_TTL_SECONDS,
    });
  },

  async generatePresignedGetUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    return getSignedUrl(s3, command, {
      expiresIn: AWS_DOWNLOAD_URL_TTL_SECONDS,
    });
  },

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
  },
};