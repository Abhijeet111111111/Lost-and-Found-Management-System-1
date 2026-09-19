import { Router } from "express";

import { protect } from "./../controllers/auth.js";
import { makeClaim } from "./../controllers/claim.js";

const router = Router();

router.post("/", protect, makeClaim);

export default router;
