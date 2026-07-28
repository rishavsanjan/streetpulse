import { Router } from "express";
import { addReaction, removeReaction, updateReaction } from "../controllers/reaction.controller.js";
import { authMiddleware } from "../middleware/middleware.js";

const router = Router();

router.post("/:id",authMiddleware, addReaction)
router.delete("/:id",authMiddleware, removeReaction)
router.patch("/:id", authMiddleware, updateReaction)

export default router;