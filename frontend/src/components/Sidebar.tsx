import Home from '@/app/page';
import { Bell, Bookmark, Compass, Mail, PlusCircle, TrendingUp, UserIcon, Users } from 'lucide-react';
import React from 'react'

const NAV_ITEMS_SECONDARY = [
    { label: 'Saved Stories', icon: Bookmark },
    { label: 'Notifications', icon: Bell },
    { label: 'Messages', icon: Mail },
    { label: 'Profile', icon: UserIcon },
];

const NAV_ITEMS = [
  { label: 'Home', icon: Home, active: true },
  { label: 'Explore', icon: Compass, active: false },
  { label: 'Trending', icon: TrendingUp, active: false },
  { label: 'Communities', icon: Users, active: false },
];

const Sidebar = () => {
    return (
        <aside className="hidden md:flex flex-col h-screen sticky left-0 top-0 w-64 bg-white border-r border-gray-200 shadow-md p-4 gap-2 z-50">
            <div className="mb-8 px-2">
                <h1 className="text-2xl font-black text-emerald-700">StreetPulse</h1>
                <p className="text-gray-500 text-xs">Your Neighborhood Hub</p>
            </div>
            <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
                {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
                    <a
                        key={label}
                        href="#"
                        className={`flex items-center gap-4 p-3 rounded-xl font-bold text-sm transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 ${active ? 'text-emerald-700 bg-emerald-100/50' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </a>
                ))}
                <div className="my-3 border-t border-gray-200" />
                {NAV_ITEMS_SECONDARY.map(({ label, icon: Icon }) => (
                    <a
                        key={label}
                        href="#"
                        className="flex items-center gap-4 p-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium text-sm transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </a>
                ))}
            </nav>
            <button className="mt-8 w-full py-3 px-6 bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-700/20">
                <PlusCircle size={20} />
                <span>Create Post</span>
            </button>
        </aside>
    )
}

export default Sidebar