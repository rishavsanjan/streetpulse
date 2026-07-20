import { Router } from "express";
import { getNotificationsController, markNotificationsAsSeenController } from "../controllers/notification.controller.js";
import { authMiddleware } from "../middleware/middleware.js";

const router = Router();
router.get("/notifications", authMiddleware, getNotificationsController);
router.patch("/notifications/seen", authMiddleware, markNotificationsAsSeenController);

export default router