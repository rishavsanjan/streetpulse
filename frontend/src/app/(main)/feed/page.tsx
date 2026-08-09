"use client"

import Header from '@/components/Header';
import MobileNavigationBar from '@/components/MobileNavigationBar';
import Post from '@/components/Post';
import RightSidebar from '@/components/RightSidebar';

import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Post as PostType } from '@/types/post';
import { useQuery } from '@tanstack/react-query';



const Page = () => {
  const { user, loading } = useAuth();

  const getPosts = useQuery({

    queryFn: async () => {
      const res = await api.get("/post");
      console.log(res.data)
      return res.data.data as PostType[];
    },
    queryKey: ['feed'],

  })




  const data: PostType[] = getPosts.data ?? [];

  console.log(data)

  if (loading) return (
    <div className='flex h-[60vh] items-center justify-center'>
      <span className='h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600' />
    </div>
  );




  return (
    <div className="flex h-screen overflow-hidden bg-[#f4fbf4] text-[#161d19]">

      {/* SideNavBar (Desktop Only) */}


      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">

        {/* TopNavBar */}
        <Header username={user?.name} />

        <div className="max-w-[1280px] mx-auto w-full flex gap-6 p-6">

          {/* Central Feed */}
          <div className="flex-1 flex flex-col gap-6 ">

            {/* Feed Filter  */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button className="px-6 py-2 bg-emerald-700 text-white rounded-full text-sm font-semibold whitespace-nowrap">All Stories</button>
              <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-emerald-100">Nearby</button>
              <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-emerald-100">Following</button>
              <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-emerald-100">Events</button>
              <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-emerald-100">Local Tips</button>
            </div>

            

            <div className="flex flex-col gap-6 pb-20">
              {
                data.map((post) => (
                  <Post key={post.id} post={post} />

                ))
              }
            </div>
            {/* ===== end posts feed ===== */}

          </div>

          {/* Right Sidebar — decorative content, not wired to real data */}
          <RightSidebar />
        </div>
      </main>

      {/* Mobile Navigation Bar — decorative */}
      <MobileNavigationBar />
    </div>
  );
}

export default Page