import prisma from "../lib/prisma.js";
import { EventSchema, EventUpdateSchema } from "../validators/event.validator.js";

export const createEventService = async (userId: string, data: EventSchema) => {

    const { images, videos, ...eventData } = data;

    const event = await prisma.event.create({
        data: {
            creatorId: userId,
            ...eventData,
            images: images?.length ? { create: images.map((url) => ({ url })) } : undefined,
            videos: videos?.length ? { create: videos.map((url) => ({ url })) } : undefined,
        }
    })


    return event;
}

export const getEventService = async (userId: string) => {
    const events = await prisma.event.findMany({
        orderBy: { startTime: "asc" },
        include: {
            _count: {
                select: {
                    interests: true,
                    eventComments: true
                }
            }
        }
    })

    return events;
}

export const getEventDetailService = async (userId: string, eventId: string) => {
    const event = await prisma.event.findUnique({
        where: {
            id: eventId,
        },
        include: {
            eventComments: true,
            creator: {
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
            interests: true
        }
    })

    if (!event) {
        throw new Error("No event found")
    }

    return event;
}

export const updateEventService = async (userId:string, eventId: string, data: EventUpdateSchema) => {
    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    })

    if (!event) {
        throw new Error("No event found")
    }
    if(event?.creatorId != userId){
        throw new Error("Not authorized")
    }
    const { images, videos, ...eventData } = data;
    return await prisma.event.update({
        where: {
            id: eventId
        },
        data: {
            ...eventData,
            images: images?.length ? { create: images.map((url) => ({ url })) } : undefined,
            videos: videos?.length ? { create: videos.map((url) => ({ url })) } : undefined,
        }
    })

}


export const deleteEventService = async (userId:string, eventId: string) => {
    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    })

    

    if (!event) {
        throw new Error("No event found")
    }

    if(event?.creatorId != userId){
        throw new Error("Not authorized")
    }
    return await prisma.event.delete({
        where: {
            id: eventId
        }
        
    })

}





