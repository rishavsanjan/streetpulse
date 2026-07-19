import { z } from "zod"

export const createPostSchema = z.object({
    caption: z.string().max(500).optional(),
    image: z.string().optional(),
    category: z.enum([
        "General",
        "Nature",
        "Food",
        "Traffic",
        "Alert",
        "LostFound",
    ]),
    placeName: z.string().optional(),
    latitude: z.number().optional(),

    longitude: z.number().optional(),

    address: z.string().optional(),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>