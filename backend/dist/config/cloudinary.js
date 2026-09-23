import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import "dotenv/config";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// 2. Create the Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: (_req, file) => ({
    folder: "lost-and-found",
    allowed_formats: ["png", "jpg", "jpeg", "pjpeg", "webp"],
    resource_type: "image",
    public_id: file.originalname.split(".")[0],
  }),
});
const upload = multer({ storage });
export default upload;
//# sourceMappingURL=cloudinary.js.map
