import {string, z} from "zod"

export const reactionSchema = z.object({
    reaction: z.enum([
        "Like",
        "Love",
        "Fire"
    ])
})

export type UserReactionSchema = z.infer<typeof reactionSchema>


