import {z} from "zod"


export const commentSchema = z.object({
    parentId : z.string().optional(),
    text: z.string().max(1000, "No more than 1000 characters allowed")
})

export type UserCommentSchema = z.infer<typeof commentSchema>