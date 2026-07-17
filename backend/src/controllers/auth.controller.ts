import { Request, Response } from "express";
import { registerSchema } from "../validators/auth.validator.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { loginSchema } from "../validators/login.validator.js";
import { success } from "zod";

export const register = async (req: Request, res: Response) => {

    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }

    try {
        const user = await registerUser(result.data);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }

}

export const login = async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors
        })
    }

    try {
        const user = await loginUser(result.data);
        return res.status(201).json({
            success: true,
            message: "User logged in successfully",
            data: user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}