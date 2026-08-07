export interface Notification {
    actorId: string,
    commentId?: string | null,
    createdAt: "2026-08-07T07:59:25.024Z"
    eventId?: string | null
    id: string
    isSeen: boolean
    postId?: string | null
    type: "Follow"
    | "FollowRequest"
    | "FollowRequestAccepted"
    | "PostReaction"
    | "PostComment"
    | "CommentReply"
    | "CommentReaction"
    | "EventInterest"
    | "EventComment"
    | "Mention"
    updatedAt: Date
    userId: string
    actor: {
        id: string,
        name: string,
        profile: {
            avatar: string
        } | null
    }
}