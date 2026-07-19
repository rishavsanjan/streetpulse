import { Router } from "express";
import { createPost, deletePost, feedPosts, postsDetails } from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/middleware.js";

const router = Router();

router.post("",authMiddleware, createPost)
router.delete("/:id",authMiddleware, deletePost)
router.get("/:id", postsDetails)
router.get("", feedPosts)

export default router;