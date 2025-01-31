import multer from "multer";

const storage = multer.memoryStorage();
console.log('*** multer use here');

export const uploadMedia = multer({ storage });