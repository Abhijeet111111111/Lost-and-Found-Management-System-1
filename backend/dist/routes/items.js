import { Router } from "express";
<<<<<<< HEAD
=======
import multer from "multer";
import storage from "../config/cloudinary.js";
import { protect } from "../controllers/auth.js";
>>>>>>> 04852e9cc913c37d7586a7e9e4acafe643919326
import { getItems, createItem } from "../controllers/items.js";
import upload from "./../config/cloudinary.js";
import "dotenv/config";
const router = Router();
router.get("/", getItems);
<<<<<<< HEAD
router.post("/", upload.single("pictureLink"), createItem);
=======
router.post("/", protect, upload.single("pictureLink"), createItem);
>>>>>>> 04852e9cc913c37d7586a7e9e4acafe643919326
export default router;
// [Incoming Request with Image]
//           │
//           ▼
// 1. protect (controllers/auth.ts)
//    └── Verifies the user is logged in (checks JWT token)
//           │
//           ▼
// 2. upload.single("pictureLink") (routes/items.ts + config/cloudinary.ts)
//    └── Intercepts the image file and sends it directly to Cloudinary
//    └── Attaches Cloudinary's response URL to `request.file`
//           │
//           ▼
// 3. createItem (controllers/items.ts)
//    └── Reads the Cloudinary URL from `request.file`
//    └── Saves the item to MongoDB with that URL!
//# sourceMappingURL=items.js.map