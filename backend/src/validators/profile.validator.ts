import z from "zod"

export const updateProfileSchema = z.object({
    bio: z.string().max(100, "Bio should have less than 100 characters").optional(),
    avatar : z.string().optional(),
    latitude:z.float64().optional(),
    longitude:z.float64().optional(),
    city:z.string().min(3, "City name should have atleast three letters").optional(),
    country:z.string().min(3, "Country name should have atleast three letters").optional()
})

export type  UpdateProfileInput = z.infer<typeof updateProfileSchema>