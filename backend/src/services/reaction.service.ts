import prisma from "../lib/prisma.js";
import { getIO } from "../socket/index.js";
import { UserReactionSchema } from "../validators/reaction.validator.js";

export const addReactionService = async (userId: string, data: UserReactionSchema, postId: string) => {
    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    });

    const vote = await prisma.vote.upsert({
        where: {
            userId_postId: {
                userId,
                postId
            }
        },
        update: {
            reaction: data.reaction
        },
        create: {
            userId: userId,
            postId: postId,
            reaction: data.reaction,

        },
        select: {
            post: {
                select: {
                    userId: true
                }
            },
            userId: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    profile: {
                        select: {
                            avatar: true
                        }
                    }
                }
            }
        },



    })

    if (vote.userId !== vote.post.userId && !existingVote) {
        
        const notification = await prisma.notification.create({
            data: {
                type: 'PostReaction',
                postId,
                userId: vote.post.userId,
                actorId: vote.userId
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: {
                                avatar: true
                            }
                        }
                    }
                }
            }
        });

        const io = getIO();

        io.to(vote.post.userId).emit("notification", notification);
    }

    return vote;

}

export const removeReactionService = async (userId: string, postId: string) => {

    const vote = await prisma.vote.delete({
        where: {
            userId_postId: {
                userId,
                postId
            }
        }
    })


    return vote;

}

export const updateReactionService = async (userId: string, postId: string, reaction: 'Like' | 'Love' | 'Fire') => {

    const vote = await prisma.vote.update({
        where: {
            userId_postId: {
                userId,
                postId
            }
        },
        data: {
            reaction: reaction
        }
    })


    return vote;

}