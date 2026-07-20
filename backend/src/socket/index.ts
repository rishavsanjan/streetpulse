import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { AuthenticatedSocket } from "../types/socket.js";
import jwt from "jsonwebtoken"
let io: Server;


export const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    });

    io.use((socket: AuthenticatedSocket, next) => {
        const token =
            socket.handshake.auth.token ||
            (socket.handshake.headers.token as string);

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!
            ) as {
                id: string;
                email: string;
            };

            socket.user = decoded;

            next(); 
        } catch (err) {
            console.error(err);
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket: AuthenticatedSocket) => {

        socket.join(socket.user!.id);

        console.log(
            `${socket.user!.email} connected (${socket.id})`
        );

        socket.on("disconnect", () => {
            console.log(
                `${socket.user!.email} disconnected`
            );
        });
    });


    return io;
}

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }

    return io;
};