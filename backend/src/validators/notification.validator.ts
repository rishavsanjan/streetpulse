import { z } from "zod"

export const notificationSchema = z.object({
    userId: z.string(),
    type: z.enum(["Follow",
        "FollowRequest",
        "FollowRequestAccepted",

        "PostReaction",
        "PostComment",
        "CommentReply",
        "CommentReaction",

        "EventInterest",
        "EventComment",

        "Mention"]),
    postId: z.string().optional(),
    eventId: z.string().optional(),
    commentId: z.string().optional()
}).refine(
    (data) =>
        data.postId ||
        data.eventId ||
        data.commentId,
    {
        message: "At least one of postId, eventId, or commentId is required."
    }
)

export type NotificationSchema = z.infer<typeof notificationSchema>