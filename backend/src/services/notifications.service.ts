import prisma from "../lib/prisma.js"
import { emitNotification } from "../socket/emit.js"
import { NotificationSchema } from "../validators/notification.validator.js"

export const getNotifications = async (userId: string) => {
    return await prisma.notification.findMany({
        where: {
            userId
        },
        orderBy: { createdAt: "desc" },
    })
}

export const createNotificationService = async (userId: string, data: NotificationSchema) => {
    if (userId === data.userId) {
        return; 
    }
    const notification = await prisma.notification.create({
        data: {
            actorId: userId,
            userId: data.userId,
            postId: data.postId,
            eventId: data.eventId,
            commentId: data.commentId,
            type: data.type
        },
        select: {
            actor: {
                select: {
                    name: true,
                    id: true,
                    profile: {
                        select: {
                            avatar: true
                        }
                    }
                }
            },
            id: true,
            type: true,
            isSeen: true,
            createdAt: true
        },

    })
    let message = "";
    if (data.type === "Follow") {
        message = `${notification.actor?.name} followed you.`;
    } else if (data.type === "FollowRequest") {
        message = `${notification.actor?.name} sent you a follow request.`;
    } else if (data.type === "FollowRequestAccepted") {
        message = `${notification.actor?.name} accepted your follow request.`;
    } else if (data.type === "PostReaction") {
        message = `${notification.actor?.name} reacted on your post.`;
    } else if (data.type === "PostComment") {
        message = `${notification.actor?.name} commented on your post.`;
    } else if (data.type === "CommentReply") {
        message = `${notification.actor?.name} replied to your comment.`;
    } else if (data.type === "CommentReaction") {
        message = `${notification.actor?.name} reacted on your comment.`;
    } else if (data.type === "EventInterest") {
        message = `${notification.actor?.name} showed interest in your event.`;
    } else if (data.type === "EventComment") {
        message = `${notification.actor?.name} commented on your event.`;
    } else if (data.type === "Mention") {
        message = `${notification.actor?.name} mentoined you.`;
    }

    const payload = {
        id: notification.id,
        type: notification.type,
        isSeen: notification.isSeen,
        createdAt: notification.createdAt,

        actor: {
            id: notification.actor!.id,
            name: notification.actor!.name,
            avatar: notification.actor!.profile?.avatar,
        },

        message: message
    };

    emitNotification(data.userId, payload)

    return notification;
}

export const markNotificationsAsSeen = async (userId: string, data: Array<string>) => {
    return await prisma.notification.updateMany({
        where: {
            id: {
                in: data,

            },
            userId

        },
        data: {
            isSeen: true
        }

    })
}