
import { PutObjectCommand, ObjectCannedACL, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import path from "path";
import s3 from "./s3Upload";

interface UploadParams {
    file: Express.Multer.File;
    folder: string;
    userId: string;
}


async function checkIfFileExists(fileExistsParams: { Bucket: string; Key: string }) {
    try {
        await s3.send(new HeadObjectCommand(fileExistsParams));
        return true; // File exists
    } catch (error: any) {
        if (error.name === "NotFound") {
            return false; // File does not exist
        }
        throw error; // Handle other potential errors
    }
}

export const uploadFileToS3 = async ({ file, folder, userId }: UploadParams): Promise<string> => {

    const fileExtension = path.extname(file.originalname);
    const fileName = `${userId}-${Date.now()}${fileExtension}`;

    const fileExistsParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || `drivers-booking`,
        Key: fileName,
    };
    const fileExists = await checkIfFileExists(fileExistsParams);

    if (fileExists) {
        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || `drivers-booking`,
            Key: fileName,
        };
        await s3.send(new DeleteObjectCommand(deleteParams));
    }

    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || `drivers-booking`,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    let response = await s3.send(new PutObjectCommand(uploadParams));

    if (response) {
        return fileName;
    } else {
        return '';
    }
};

export const deleteFileToS3 = async ({ fileName }: { fileName: string }): Promise<string> => {
    const fileExistsParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || `drivers-booking`,
        Key: fileName,
    };
    const fileExists = await checkIfFileExists(fileExistsParams);

    if (fileExists) {
        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || `drivers-booking`,
            Key: fileName,
        };
        let deleteFile = await s3.send(new DeleteObjectCommand(deleteParams));
        return fileName;
    }
    return ''
};
