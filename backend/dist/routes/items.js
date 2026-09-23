import { Router } from "express";
import { getItems, createItem } from "../controllers/items.js";
import upload from "./../config/cloudinary.js";
import "dotenv/config";
const router = Router();
router.get("/", getItems);
router.post("/", upload.single("pictureLink"), createItem);
export default router;
//# sourceMappingURL=items.js.map