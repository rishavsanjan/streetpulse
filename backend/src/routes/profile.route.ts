import { Router } from "express";
import { authMiddleware } from "../middleware/middleware.js";
import { getUserProfile, profile, updateProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/me", authMiddleware, profile)
router.patch("", authMiddleware, updateProfile)
router.get("/:id", getUserProfile)

export default router;