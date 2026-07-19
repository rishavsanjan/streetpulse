import { Router } from "express";
import { authMiddleware } from "../middleware/middleware.js";
import { addComment, deleteComment, getComment, updateComment } from "../controllers/comment.controller.js";

const router = Router();

router.post(":/id", authMiddleware, addComment)
router.get("/:id", getComment)
router.patch("/:id", authMiddleware, updateComment)
router.delete("/id", authMiddleware, deleteComment)

export default router;