import { Compass, Home, MessageCircle, Plus, UserIcon } from 'lucide-react'
import React from 'react'

const MobileNavigationBar = () => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md bg-white/90 border-t border-gray-200 flex justify-around items-center py-2 px-6 z-50">
            <button className="flex flex-col items-center gap-1 text-emerald-700">
                <Home size={20} />
                <span className="text-[11px]">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500">
                <Compass size={20} />
                <span className="text-[11px]">Explore</span>
            </button>
            <button className="w-14 h-14 bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-700/30 flex items-center justify-center -translate-y-4 border-4 border-white transition-transform active:scale-90">
                <Plus size={28} />
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500">
                <MessageCircle size={20} />
                <span className="text-[11px]">Chat</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500">
                <UserIcon size={20} />
                <span className="text-[11px]">Me</span>
            </button>
        </nav>
    )
}

export default MobileNavigationBar