import prisma from "../lib/prisma.js"
import { UpdateProfileInput } from "../validators/profile.validator.js"

export const userProfile = async (data: {
    id: string,
    email: string
}) => {
    const user = await prisma.user.findUnique({
        where: {
            id: data.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            profile: true
        }
    })

    if (!user) {
        throw new Error("User does not exist")
    }

    return {
        user: user
    }
}

export const updateUserProfile = async (
    userId: string,
    data: UpdateProfileInput
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true
        }
    })

    if (!user) {
        throw new Error("User does not exist")
    }

    return await prisma.profile.upsert({
        where: {
            userId: userId
        },
        update: data,
        create: {
            userId,
            ...data
        }
    })
}

export const getUserProfileService = async (
    userId: string
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,

            profile: {
                select: {
                    bio: true,
                    avatar: true,
                    city: true,
                    country: true,
                },
            },

            _count: {
                select: {
                    posts: true,
                    followers: true,
                    following: true,
                },
            },
        },
    })

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}