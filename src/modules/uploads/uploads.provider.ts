import {S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@config/env";


const s3 = new S3Client({region: env.AWS_REGION})