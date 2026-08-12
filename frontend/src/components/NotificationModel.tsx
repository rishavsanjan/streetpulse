import api from '@/lib/axios';
import { Notification } from '@/types/notification';
import { useQuery } from '@tanstack/react-query';
import { Bell, CheckCheck, X } from 'lucide-react';
import React from 'react'

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const NotificationModel = ({ isOpen, onClose }: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await api.get(`/notification`);
            console.log(res.data.notifications)
            return res.data.notifications as Notification[];
        }
    })

    console.log(data)

    if (!isOpen) return null;

    return (
        <>
            {/* backdrop — click outside to close, mobile gets a dimmed full-screen scrim */}
            <div
                className="fixed inset-0 z-40 bg-black/10 sm:bg-transparent"
                onClick={onClose}
            />

            <div className="absolute right-0 top-full mt-2 z-50 w-[360px] max-w-[92vw] max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded-full px-2 py-1 transition-colors">
                            <CheckCheck size={14} />
                            Mark as read
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col gap-3 p-4">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-3 animate-pulse">
                                    <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                                    <div className="flex-1 h-3 rounded bg-gray-100" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && (!data || data.length === 0) && (
                        <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center">
                            <Bell size={28} className="text-gray-300" />
                            <p className="text-sm text-gray-400">No notifications yet</p>
                        </div>
                    )}

                    {
                        data?.map((notification) => (
                            <div key={notification.id} className="border-b border-gray-50 last:border-b-0">
                                {
                                    notification.type === "PostReaction" &&
                                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                                        {
                                            notification.actor.profile?.avatar ?
                                                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                                    <img src={notification.actor.profile.avatar} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                :
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                                                    <span>{notification.actor.name[0]}</span>
                                                </div>
                                        }
                                        <span className="text-sm text-gray-700 leading-snug">
                                            <span className="font-semibold text-gray-900">{notification.actor.name}</span>{` liked your post.`}
                                        </span>
                                    </div>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default NotificationModel