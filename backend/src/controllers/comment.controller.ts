import { Request, Response } from "express";
import { commentSchema } from "../validators/comment.validator.js";
import { addCommentService, deleteCommentService, getCommentService, updateCommentService } from "../services/comment.service.js";



type PostIdParams = { id: string };   
type CommentIdParams = { id: string };

export const addComment = async (req: Request<PostIdParams>, res: Response) => {
    const result = commentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }

    try {
        const comment = await addCommentService(req.user.id, req.params.id, result.data);
        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: comment,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to add comment",
        });
    }
}

export const getComment = async (req: Request<PostIdParams>, res: Response) => {

    try {
        const comment = await getCommentService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Comment fetched successfully",
            data: comment,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to fetch comment",
        });
    }
}

export const updateComment = async (req: Request<CommentIdParams>, res: Response) => {
    const result = commentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }

    try {
        const comment = await updateCommentService(req.user.id, req.params.id, result.data);
        return res.status(201).json({
            success: true,
            message: "Comment updated successfully",
            data: comment,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to add comment",
        });
    }
}

export const deleteComment = async (req: Request<CommentIdParams>, res: Response) => {
    
    try {
        const comment = await deleteCommentService(req.user.id, req.params.id);
        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: comment,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to delete comment",
        });
    }
}