import crypto from "node:crypto";
import { UploadContext } from "./uploads.types";
import { uploadsProvider } from "./uploads.provider";

function extensionFor(contentType: string): string{
    return contentType.split("/")[1]; // "image/webp" -> "webp"
}

export const uploadsService = {
    async requestUploadUrl(context: UploadContext, contentType:string, ownerId: string){
        const key = `${context}/${ownerId}/${crypto.randomUUID()}.${extensionFor(contentType)}`

        const uploadUrl = await uploadsProvider.generatePresignedPutUrl(key, contentType)

        // const publicUrl = await uploadsProvider.generatePresignedGetUrl(key);

         return { uploadUrl, key };
    }
}
