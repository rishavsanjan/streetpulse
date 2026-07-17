import prisma from "../lib/prisma.js";
import { RegisterInput } from "../validators/auth.validator.js";
import bcrypt from "bcrypt"
import { LoginInput } from "../validators/login.validator.js";
import jwt from "jsonwebtoken";

export const registerUser = async (data: RegisterInput) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (existingUser) {
        throw new Error("Email already exists!")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        }
    })

    return user;
}

export const loginUser = async (data: LoginInput) => {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })


    if (!user) {
        throw new Error("User does not exist!")
    }

    const passwordMatch = await bcrypt.compare(
        data.password, user.password
    )

    if (!passwordMatch) {
        throw new Error("Invalid  password");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "7d"
        }
    );


    return {
        token: token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }
}