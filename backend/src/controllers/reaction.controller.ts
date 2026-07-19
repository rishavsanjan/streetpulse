import { Request, Response } from "express";
import { reactionSchema } from "../validators/reaction.validator.js";
import { addReactionService, removeReactionService } from "../services/reaction.service.js";


type AddReactionProps = {
    id : string
}
export const addReaction = async (req: Request<AddReactionProps>, res: Response) => {
    const result = reactionSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }

    try {
        const vote = addReactionService(req.user.id, result.data, req.params.id);
        return res.status(201).json({
            success: true,
            message: "Reaction added successfully",
            data: vote,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to add vote",
        });
    }
}

type DeleteReactionProps = {
    id : string
}

export const removeReaction = async (req: Request<DeleteReactionProps>, res: Response) => {
    

    try {
        const vote = removeReactionService(req.user.id, req.params.id);
        return res.status(201).json({
            success: true,
            message: "Reaction removed successfully",
            data: vote,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to remove vote",
        });
    }
}