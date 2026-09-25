import { Router } from "express";
import multer from "multer";
import upload from "../config/cloudinary.js";
import { protect, restrictTo } from "../controllers/auth.js";
import {
  analyzeClaim,
  getClaims,
  makeClaim,
  updateClaimStatus,
} from "../controllers/claim.js";

const router = Router();
// const upload = multer({ storage });

router.get("/", protect, restrictTo("admin"), getClaims);
router.post("/", protect, upload.single("claimPicture"), makeClaim);
router.patch("/:id/status", protect, restrictTo("admin"), updateClaimStatus);
router.post("/:id/ai-analyze", protect, restrictTo("admin"), analyzeClaim);

export default router;
