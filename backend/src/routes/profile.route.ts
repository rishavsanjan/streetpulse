import { Router } from "express";
import { authMiddleware } from "../middleware/middleware.js";
import { getPersonalProfile, getUserProfile, profile, updateProfile } from "../controllers/profile.controller.js";

const router = Router();

router.get("/me", authMiddleware, profile)
router.patch("", authMiddleware, updateProfile)
router.get("/:id", getUserProfile)
router.get("", authMiddleware, getPersonalProfile)

export default router;