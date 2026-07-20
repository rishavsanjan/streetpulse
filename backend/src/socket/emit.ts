import { getIO } from "./index.js";

export const emitNotification = (
    receiverId: string,
    notification: unknown
) => {
    getIO()
        .to(receiverId)
        .emit("notification:new", notification);
};