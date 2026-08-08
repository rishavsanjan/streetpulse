import { BarChart3 } from 'lucide-react'
import React from 'react'

const RightSidebar = () => {
    return (
        <aside className="hidden xl:flex flex-col gap-6 w-80 sticky top-6 h-fit">
            <section className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Trending Locally</h2>
                    <BarChart3 size={20} className="text-emerald-700" />
                </div>
                <div className="flex flex-col gap-4">
                    <div className="p-4 bg-white rounded-2xl hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-emerald-200">
                        <p className="text-xs text-emerald-700 font-bold mb-1">#OakDistrictVibes</p>
                        <p className="font-bold text-sm">Celebrating the new community garden mural</p>
                        <p className="text-gray-400 text-[11px] mt-2">1.2k people talking about this</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-emerald-200">
                        <p className="text-xs text-emerald-700 font-bold mb-1">#ShopLocal</p>
                        <p className="font-bold text-sm">The Best Coffee Shops for Remote Work</p>
                        <p className="text-gray-400 text-[11px] mt-2">850 posts today</p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-emerald-200">
                        <p className="text-xs text-emerald-700 font-bold mb-1">#NeighborhoodMeetup</p>
                        <p className="font-bold text-sm">Weekend Yoga in Central Park</p>
                        <p className="text-gray-400 text-[11px] mt-2">240 neighbors interested</p>
                    </div>
                </div>
                <button className="w-full mt-6 text-emerald-700 font-bold text-sm hover:underline">Explore all trends</button>
            </section>

            <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Local Connections</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-emerald-700">SC</div>
                            <div>
                                <p className="font-bold text-sm leading-none">Sarah Chen</p>
                                <p className="text-xs text-gray-400 mt-1">2 blocks away</p>
                            </div>
                        </div>
                        <button className="text-emerald-700 font-bold text-sm">Follow</button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">MJ</div>
                            <div>
                                <p className="font-bold text-sm leading-none">Marcus Jordan</p>
                                <p className="text-xs text-gray-400 mt-1">Local Guide</p>
                            </div>
                        </div>
                        <button className="text-emerald-700 font-bold text-sm">Follow</button>
                    </div>
                </div>
                <button className="w-full mt-6 bg-emerald-50 text-emerald-700 py-2 rounded-xl font-bold transition-transform active:scale-95">Find more neighbors</button>
            </section>

            <footer className="px-2 flex flex-wrap gap-x-4 gap-y-1 opacity-50 text-[12px]">
                <a className="hover:underline" href="#">About StreetPulse</a>
                <a className="hover:underline" href="#">Guidelines</a>
                <a className="hover:underline" href="#">Privacy</a>
                <a className="hover:underline" href="#">Safety</a>
                <span>© 2026 StreetPulse</span>
            </footer>
        </aside>
    )
}

export default RightSidebar