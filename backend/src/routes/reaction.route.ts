import { Router } from "express";
import { addReaction, removeReaction } from "../controllers/reaction.controller.js";
import { authMiddleware } from "../middleware/middleware.js";

const router = Router();

router.post("/:id",authMiddleware, addReaction)
router.delete("/:id",authMiddleware, removeReaction)

export default router;