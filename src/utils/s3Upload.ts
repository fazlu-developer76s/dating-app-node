import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION || `eu-north-1`,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIAXWHDLYDYHYB2PHUR',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || `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`,
    },
});

export default s3;