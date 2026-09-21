import { Router } from "express";
import multer from "multer";
import storage from "../config/cloudinary.js";
import { protect } from "../controllers/auth.js";
import { getItems, createItem } from "../controllers/items.js";
const router = Router();
const upload = multer({ storage });
router.get("/", getItems);
router.post("/", protect, upload.single("pictureLink"), createItem);
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