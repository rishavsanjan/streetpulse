import { Request, Response } from "express";
import {
    followService,
    unfollowService,
    getFollowersService,
    getFollowingService,
} from "../services/follow.service.js";

type IdParams = {
    id: string;
};

export const followUser = async (req: Request<IdParams>, res: Response) => {
    try {
        const follow = await followService(req.user.id, req.params.id);
        return res.status(201).json({
            success: true,
            message: "Followed successfully",
            data: follow,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to follow user";
        const statusCode =
            message === "Cannot follow yourself" ? 400 :
                message === "Already following this user" ? 409 :
                    message === "User to follow does not exist" ? 404 :
                        500;

        return res.status(statusCode).json({ success: false, message });
    }
};

export const unfollowUser = async (req: Request<IdParams>, res: Response) => {
    try {
        const follow = await unfollowService(req.user.id, req.params.id);
        return res.status(200).json({
            success: true,
            message: "Unfollowed successfully",
            data: follow,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to unfollow user";
        const statusCode = message === "User does not follow" ? 404 : 500;

        return res.status(statusCode).json({ success: false, message });
    }
};

export const getFollowers = async (req: Request<IdParams>, res: Response) => {
    try {
        const followers = await getFollowersService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Followers fetched successfully",
            data: followers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to fetch followers",
        });
    }
};

export const getFollowing = async (req: Request<IdParams>, res: Response) => {
    try {
        const following = await getFollowingService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Following fetched successfully",
            data: following,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to fetch following",
        });
    }
};