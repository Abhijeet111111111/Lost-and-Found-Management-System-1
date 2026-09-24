import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// 2. Create the Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'lost-and-found',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        };
    },
});
// 3. Export default storage so your router can import it!
export default storage;
//# sourceMappingURL=cloudinary.js.map