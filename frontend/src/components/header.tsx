

import React, { useState } from 'react'
import { Bell, Moon, Search, UserIcon, UserPlus } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import NotificationModel from './NotificationModel';

interface Props {
  username?: string
}

type activeModelKey = "Notification" | "Requests" | ""

const Header: React.FC<Props> = ({ username }) => {
  const [activeModel, setActiveModel] = useState<activeModelKey>("");


  const closeModal = () => {
    setActiveModel("")
  }


  return (
    <header className="sticky absolute top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm flex justify-between items-center w-full px-6 py-2">
      <div className="flex items-center gap-6 flex-1">
        <div className="md:hidden text-2xl text-emerald-700 font-bold">StreetPulse</div>
        <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-full border border-gray-200 flex-1 ">
          <Search size={18} className="text-gray-500" />
          <input className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2" placeholder="Search posts and neighbors..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-6">
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
            <UserPlus size={20} />
          </button>
          <button
            onClick={() => {
              setActiveModel("Notification")
            }}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
            <Bell size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
            <Moon size={20} />
          </button>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-emerald-200 bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600 overflow-hidden">
          {username?.toUpperCase() ?? <UserIcon size={18} className="text-gray-400" />}
        </div>
      </div>
      <div className=''>
        {
          activeModel === "Notification" &&
          <div className='relative'>
            <NotificationModel
              isOpen={activeModel === "Notification"}
              onClose={closeModal}
            />
          </div>

        }
      </div>

    </header>
  )
}

export default Header

