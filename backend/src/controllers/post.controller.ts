import { Request, Response } from "express";
import { createPostSchema } from "../validators/post.validator.js";
import { createPostService, deletePostService, feedPostsService, postDetailService } from "../services/post.service.js";

export const createPost = async (req: Request, res: Response) => {
    const result = createPostSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }

    try {
        const post = await createPostService(req.user.id, result.data);
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to create post",
        });
    }

}

type DeletePostProps = {
    id: string
}

export const deletePost = async (req: Request<DeletePostProps>, res: Response) => {

    try {
        const post = await deletePostService(req.params.id, req.user.id);
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: post,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to delete post",
        });
    }

}


export const postsDetails = async (req: Request<DeletePostProps>, res: Response) => {

    try {
        const post = await postDetailService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to fetch post",
        });
    }

}

export const feedPosts = async (req: Request, res: Response) => {

    
    try {
        const post = await feedPostsService(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            data: post,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to fetch post",
        });
    }

}