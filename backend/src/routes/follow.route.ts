import { Router } from "express";
import { authMiddleware } from "../middleware/middleware.js";
import { followUser, getFollowers, getFollowing, unfollowUser } from "../controllers/follow.controller.js";

const router = Router();

router.post("/:id/follow", authMiddleware, followUser)
router.delete("/id/follow", authMiddleware, unfollowUser)
router.get("/:id/followers", getFollowers)
router.get("/:id/following", getFollowing)


export default router