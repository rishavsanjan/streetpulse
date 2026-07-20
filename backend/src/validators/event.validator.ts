import { z } from "zod"

export const eventSchema = z.object({
    title: z.string().max(100, "max 100 words"),
    description: z.string().max(500, "max 500 words"),
    latitude: z.float64(),
    longitude: z.float64(),
    placeName: z.string().optional(),
    address: z.string().max(100, "max 100 chars address"),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    visibility: z.enum([
        "Public",
        "Friends"
    ]),
    images: z.array(z.url()).optional(),
    videos: z.array(z.url()).optional(),

})
export const eventUpdateSchema = eventSchema.partial();
export type EventUpdateSchema = z.infer<typeof eventUpdateSchema>;
export type EventSchema = z.infer<typeof eventSchema>