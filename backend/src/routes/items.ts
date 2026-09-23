import { Router } from "express";
import { protect } from "../controllers/auth.js";
import { getItems, createItem } from "../controllers/items.js";
import upload from "./../config/cloudinary.js";
import "dotenv/config";

const router = Router();

router.get("/", getItems);
router.post("/", upload.single("pictureLink"), createItem);

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


