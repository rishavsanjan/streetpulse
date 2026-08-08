import prisma from "../lib/prisma.js";
import { getIO } from "../socket/index.js";
import { UserReactionSchema } from "../validators/reaction.validator.js";

export const addReactionService = async (
    userId: string,
    data: UserReactionSchema,
    postId: string
) => {
    const result = await prisma.$transaction(async (tx) => {

        const vote = await tx.vote.upsert({
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
                userId,
                postId,
                reaction: data.reaction
            },
            select: {
                post: {
                    select: {
                        userId: true,
                        id: true
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
            }
        });

        let shouldEmit = false;
        let notification = null;

        if (vote.userId !== vote.post.userId) {

            const existingNotification =
                await tx.notification.findUnique({
                    where: {
                        userId_actorId_type_targetType_targetId: {
                            userId: vote.post.userId,
                            actorId: vote.userId,
                            type: "PostReaction",
                            targetType: "POST",
                            targetId: postId
                        }
                    }
                });

            if (!existingNotification) {

                notification = await tx.notification.create({
                    data: {
                        type: "PostReaction",
                        postId,
                        userId: vote.post.userId,
                        actorId: vote.userId,
                        targetId: postId,
                        targetType: "POST"
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

                shouldEmit = true;

            }
            else if (!existingNotification.isActive) {

                notification = await tx.notification.update({
                    where: {
                        id: existingNotification.id
                    },
                    data: {
                        isActive: true,
                        isSeen: false
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

                shouldEmit = false;
            }
        }

        return {
            vote,
            notification,
            shouldEmit
        };
    });



    if (result.shouldEmit && result.notification) {
        const io = getIO();

        io.to(result.vote.post.userId).emit(
            "notification",
            result.notification
        );
    }

    return result.vote;
};

export const removeReactionService = async (userId: string, postId: string) => {

    const result = await prisma.$transaction(async (tx) => {
        const vote = await tx.vote.delete({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            },
            include: {
                post: {
                    select: {
                        userId: true
                    }
                }
            }


        })

        if (userId !== vote.userId) {
            await tx.notification.update({
                where: {
                    userId_actorId_type_targetType_targetId: {
                        userId: vote.post.userId,
                        actorId: userId,
                        type: "PostReaction",
                        targetType: 'POST',
                        targetId: vote.postId
                    }
                },
                data: {
                    isActive: false
                }
            })
        }



        return { vote }
    })




    return result.vote;

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