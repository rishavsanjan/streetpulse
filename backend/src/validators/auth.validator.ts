import { email, z } from "zod"

export const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(20, "max name length is 20"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "must be 8 characters long").max(100, "must be less then 100 characters")

})

export type RegisterInput = z.infer<typeof registerSchema>