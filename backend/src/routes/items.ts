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
