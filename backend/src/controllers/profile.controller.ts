import { Request, Response } from "express";
import { getUserProfileService, updateUserProfile, userProfile } from "../services/profile.service.js";
import { updateProfileSchema } from "../validators/profile.validator.js";

export const profile = async (req: Request, res: Response) => {

    try {
        const user = await userProfile(req.user);

        return res.status(200).json({
            success: true,
            user: user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }

    try {
        const user = await updateUserProfile(req.user.id, result.data);
        return res.status(201).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}

type UserParams = {
  id: string;
};

export const getUserProfile = async (req: Request<UserParams>, res: Response) => {

    try {
        const user = await getUserProfileService(req.params.id);
        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "User not found",
        });
    }
}