import { Request, Response } from "express";
import { eventSchema, eventUpdateSchema } from "../validators/event.validator.js";
import {
    createEventService,
    getEventService,
    getEventDetailService,
    updateEventService,
    deleteEventService,
} from "../services/event.service.js";

export const createEventController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const parsed = eventSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten(),
            });
        }

        const event = await createEventService(userId, parsed.data);
        return res.status(201).json({ event });
    } catch (error) {
        console.error("createEventController error:", error);
        return res.status(500).json({ message: "Failed to create event" });
    }
};

export const getEventController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const events = await getEventService(userId);
        return res.status(200).json({ events });
    } catch (error) {
        console.error("getEventController error:", error);
        return res.status(500).json({ message: "Failed to fetch events" });
    }
};

type EventIdParams = {
    id: string
}

export const getEventDetailController = async (req: Request<EventIdParams>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const eventId = req.params.id;
        if (!eventId) {
            return res.status(400).json({ message: "eventId is required" });
        }

        const event = await getEventDetailService(userId, eventId);
        return res.status(200).json({ event });
    } catch (error) {
        if (error instanceof Error && error.message === "No event found") {
            return res.status(404).json({ message: error.message });
        }
        console.error("getEventDetailController error:", error);
        return res.status(500).json({ message: "Failed to fetch event" });
    }
};

export const updateEventController = async (req: Request<EventIdParams>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const eventId = req.params.id;
        if (!eventId) {
            return res.status(400).json({ message: "eventId is required" });
        }

        const parsed = eventUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten(),
            });
        }

        const event = await updateEventService(userId, eventId, parsed.data);
        return res.status(200).json({ event });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "No event found") {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === "Not authorized") {
                return res.status(403).json({ message: error.message });
            }
        }
        console.error("updateEventController error:", error);
        return res.status(500).json({ message: "Failed to update event" });
    }
};

export const deleteEventController = async (req: Request<EventIdParams>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const eventId = req.params.id;
        if (!eventId) {
            return res.status(400).json({ message: "eventId is required" });
        }

        await deleteEventService(userId, eventId);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "No event found") {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === "Not authorized") {
                return res.status(403).json({ message: error.message });
            }
        }
        console.error("deleteEventController error:", error);
        return res.status(500).json({ message: "Failed to delete event" });
    }
};