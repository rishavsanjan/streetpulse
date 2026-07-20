import { Request, Response } from "express";
import { z } from "zod";
import { getNotifications, markNotificationsAsSeen } from "../services/notifications.service.js";


const markSeenSchema = z.object({
    notificationIds: z.array(z.string()).min(1, "At least one notification id is required"),
});

export const getNotificationsController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const notifications = await getNotifications(userId);
        return res.status(200).json({ notifications });
    } catch (error) {
        console.error("getNotificationsController error:", error);
        return res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

export const markNotificationsAsSeenController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const parsed = markSeenSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten(),
            });
        }

        const notifications = await markNotificationsAsSeen(userId, parsed.data.notificationIds);
        return res.status(200).json({ notifications });
    } catch (error) {
        console.error("markNotificationsAsSeenController error:", error);
        return res.status(500).json({ message: "Failed to update notifications" });
    }
};