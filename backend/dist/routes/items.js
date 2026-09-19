import { Router } from "express";
import multer from "multer";
import storage from "../config/cloudinary.js";
import { getItems, createItem } from "../controllers/items.js";
const router = Router();
const upload = multer({ storage });
router.get("/", getItems);
router.post("/", () => {
    console.log("ran");
}, createItem);
export default router;
//# sourceMappingURL=items.js.map