import { Router } from "express";
import multer from "multer";
import storage from "./../config/cloudinary.js"; // Import your Cloudinary storage
import { protect } from "./../controllers/auth.js";
import { makeClaim } from "./../controllers/claim.js";
const router = Router();
const upload = multer({ storage });
// Add upload.single("claimPicture") between protect and makeClaim
router.post("/", protect, upload.single("claimPicture"), makeClaim);
export default router;
//# sourceMappingURL=claims.js.map