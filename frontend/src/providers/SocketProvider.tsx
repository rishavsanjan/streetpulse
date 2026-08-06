"use client"

import { socket } from "@/lib/socket";
import { useEffect } from "react"

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




        return () => {
            socket.disconnect();
        }
    }, [])

    return <>{children}</>
}