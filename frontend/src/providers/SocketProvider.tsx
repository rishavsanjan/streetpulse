"use client"

import { queryClient } from "@/lib/queryClient";
import { socket } from "@/lib/socket";
import { Notification } from "@/types/notification";
import { useEffect } from "react"
import { toast } from "sonner";

interface Props {
    children: React.ReactNode
}

export default function SocketProvider({ children }: Props) {
    useEffect(() => {
        const token = localStorage.getItem("streetpulse");

        if (!token) {
            return;
        }

        socket.auth = {
            token,
        }

        if (!socket.connected) {
            socket.connect();
        }

        socket.on("welcome", (data) => {
            console.log(data)
        })

        socket.on("notification", (notification: Notification) => {
            console.log(notification)
            switch (notification.type) {
                case "PostReaction":
                    toast.success(`${notification.actor?.name ?? "Someone"} reacted to your post.`)
                    break;
                default:
                    break;
            }

            queryClient.setQueryData<Notification[]>(
                ["notifications"],
                (old = []) => [notification, ...old]
            )

        })

        return () => {
            socket.disconnect();
        }
    }, [])

    return <>{children}</>
}