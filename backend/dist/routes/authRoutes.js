import { Router } from "express";
import * as authController from "../controllers/auth.js";
const router = Router();
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.get("/logout", authController.logout);
export default router;
//# sourceMappingURL=authRoutes.js.map