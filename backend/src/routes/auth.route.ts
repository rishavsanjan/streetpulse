import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/middleware.js";
import prisma from "../lib/prisma.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, async (req, res) => {
    console.log(req.user)
    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    return res.json(user);
});

export default router;