import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.cloud_cloudinary,
    api_key: process.env.api_key_cloudinary,
    api_secret: process.env.api_secrect_cloudinary,
});

const uploadPic = async (localpath: string) => {
    console.log('*****');
    console.log('*****');
    console.log('*****');
    console.log('*****', localpath);

    try {
        if (!localpath) {
            return { message: "No file path provided", success: false };
        }
        let image = null;
        let video = null;
        const timestamp = Math.floor(new Date().getTime() / 1000);

        if (localpath) {
            const imagePath = localpath.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)
            if (imagePath) {
                const result = await cloudinary.uploader.upload(localpath, {
                    resource_type: "image",
                    timestamp: timestamp,
                });
                image = result.secure_url
            } else if (localpath.match(/\.(mp4|mkv|mov|avi)$/i)) {
                const videoUploadResult = await cloudinary.uploader.upload(localpath, {
                    resource_type: "video",
                    timestamp: timestamp,
                });
                video = videoUploadResult.secure_url;
            } else {
                return { message: "Invalid file", success: false };
            }
        }
        return {
            message: "uploaded successfully",
            success: true,
            image: image,
            video: video,
        }
    } catch (error) {
        return { message: "Failed to upload", success: false, error: error };
    }
}


export default uploadPic