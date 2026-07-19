import prisma from "../lib/prisma.js"

export const followService = async (userId: string, followingId: string) => {

    if (userId === followingId) {
        throw new Error("Cannot follow yourself");
    }
    const follow = await prisma.follow.create({
        data: {
            followerId: userId,
            followingId
        }
    })

    return follow;
}

export const unfollowService = async (userId: string, followingId: string) => {
    return await prisma.follow.delete({
        where: {
            followerId_followingId: {
                followerId: userId,
                followingId,
            },
        },
    });

}

export const getFollowersService = async (userId: string) => {
    return await prisma.follow.findMany({
        where: {
            followingId: userId
        }
    })
}

export const getFollowingService = async (userId: string) => {
    return await prisma.follow.findMany({
        where: {
            followerId: userId
        }
    })
}