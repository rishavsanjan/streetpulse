"use client"

import ReactionModel from '@/components/ReactionModel';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { handleReaction, timeAgo } from '@/lib/post';
import { queryClient } from '@/lib/queryClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Flame, Heart, MessageCircle, ThumbsDown, ThumbsUp,
  Home, Compass, TrendingUp, Users, Bookmark, Bell, Mail, User as UserIcon,
  PlusCircle, Search, UserPlus, Moon, MapPin, Send, Plus, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';


interface Post {
  id: string;
  caption: string | null;
  category: "General" | "Nature" | "Food" | "Traffic" | "Alert" | "LostFound";

  placeName: string | null;
  latitude: number;
  longitude: number;
  address: string;

  userId: string;
  user: User;

  images: Image[];
  votes: Vote[]

  createdAt: string;
  updatedAt: string;

  _count: {
    comments: number;
    votes: number;
  };
}

interface Vote {
  id: string,
  userId: string,
  postId: string,
  reaction: 'Like' | 'Love' | 'Fire'
}

interface Image {
  id: string;
  url: string;
  postId: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  profile: null;
}

type ReactionType = "Like" |
  "Love" |
  "Fire"

type ReactionAction = "add" | "remove" | "update"

type ReactionVariables = {
  reactionAction: ReactionAction;
  reactionType: ReactionType;
  postId: string;
};


const CATEGORY_STYLES: Record<Post['category'], string> = {
  General: 'bg-slate-100 text-slate-600',
  Nature: 'bg-emerald-50 text-emerald-600',
  Food: 'bg-orange-50 text-orange-600',
  Traffic: 'bg-amber-50 text-amber-700',
  Alert: 'bg-red-50 text-red-600',
  LostFound: 'bg-indigo-50 text-indigo-600',
};

const NAV_ITEMS = [
  { label: 'Home', icon: Home, active: true },
  { label: 'Explore', icon: Compass, active: false },
  { label: 'Trending', icon: TrendingUp, active: false },
  { label: 'Communities', icon: Users, active: false },
];

const NAV_ITEMS_SECONDARY = [
  { label: 'Saved Stories', icon: Bookmark },
  { label: 'Notifications', icon: Bell },
  { label: 'Messages', icon: Mail },
  { label: 'Profile', icon: UserIcon },
];

const Page = () => {
  const { user, loading } = useAuth();
  const [showReactionModel, setShowReactionModel] = useState("");
  const [comment, setComment] = useState({
    id: "",
    text: ""
  });
  const queryClient = useQueryClient();
  const getPosts = useQuery({

    queryFn: async () => {
      const res = await api.get("/post");
      console.log(res.data)
      return res.data.data as Post[];
    },
    queryKey: ['feed'],

  })

  // useEffect(() => {
  //   socket.on("notification", ({ type, notification }) => {
  //     switch (type) {
  //       case "LIKE":
  //         toast.success(`${notification.sender.name} liked your post`);
  //         break;
  //       case "COMMENT":
  //         toast.success(`${notification.sender.name} commented on your post`);
  //         break;

  //       case "REPLY":
  //         toast.success(`${notification.sender.name} replied to your comment`);
  //         break;
  //     }
  //   })
  // }, [])




  const handleReactionMutation = useMutation({
    mutationKey: ['reaction'],
    mutationFn: handleReaction,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Post[]>(["feed"], (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id !== variables.postId) return post;

          return {
            ...post,
            _count: {
              ...post._count,
              votes:
                variables.reactionAction === "add"
                  ? post._count.votes + 1 :
                  variables.reactionAction === "update"
                    ? post._count.votes
                    : post._count.votes - 1,
            },

            votes:
              variables.reactionAction === "add"
                ? [
                  ...post.votes.filter((v) => v.userId !== user?.id),
                  {
                    id: crypto.randomUUID(),
                    postId: variables.postId,
                    userId: user!.id,
                    reaction: variables.reactionType,
                  },
                ] :
                variables.reactionAction === "update" ? [
                  ...post.votes.map((vote) => {
                    if (vote.userId === user?.id) {
                      return {
                        ...vote,
                        reaction: variables.reactionType
                      }

                    }

                    return vote;
                  })
                ]

                  : post.votes.filter((v) => v.userId !== user?.id),
          };
        });
      });

    },
    onError: () => {
      toast.error("Something went wrong")
    }

  })

  const handleAddCommentMutation = useMutation({
    mutationKey: ['comment'],
    mutationFn: async ({ parentId, postId }: { parentId: string | null, postId: string }) => {
      const res = await api.post(`/comment/${postId}`, {
        parentId,
        text: comment.text
      });

      return res.data
    },
    onSuccess: () => {
      toast.success("Comment added successfully")
      setComment(({ text: "", id: "" }))
    },
    onError: () => {
      toast.error("Something went weong")
    }
  })

  const handleAddReaction = ({ reactionAction, reactionType, postId }: ReactionVariables) => {

    handleReactionMutation.mutate({
      reactionAction,
      reactionType,
      postId
    })
  }






  const data: Post[] = getPosts.data ?? [];

  console.log(data)

  if (loading) return (
    <div className='flex h-[60vh] items-center justify-center'>
      <span className='h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600' />
    </div>
  );




  return (
    <div className="flex h-screen overflow-hidden bg-[#f4fbf4] text-[#161d19]">

      {/* SideNavBar (Desktop Only) — decorative, not wired to routing */}
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

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">

        {/* TopNavBar — decorative search, real user avatar/initial */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm flex justify-between items-center w-full px-6 py-2">
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
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
                <Moon size={20} />
              </button>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-200 bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-600 overflow-hidden">
              {user?.name?.[0]?.toUpperCase() ?? <UserIcon size={18} className="text-gray-400" />}
            </div>
          </div>
        </header>

        <div className="max-w-[1280px] mx-auto w-full flex gap-6 p-6">

          {/* Central Feed */}
          <div className="flex-1 flex flex-col gap-6 ">

            {/* Feed Filter Chips — decorative, no filtering logic wired */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button className="px-6 py-2 bg-emerald-700 text-white rounded-full text-sm font-semibold whitespace-nowrap">All Stories</button>
              <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-emerald-100">Nearby</button>
              <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-emerald-100">Following</button>
              <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-emerald-100">Events</button>
              <button className="px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold whitespace-nowrap hover:bg-emerald-100">Local Tips</button>
            </div>

            {/* ===== Posts feed — logic unchanged from original ===== */}
            {/* NOTE: this snippet needs `MapPin`, `Send`, `Bookmark` added to your lucide-react import line */}

            <div className="flex flex-col gap-6 pb-20">
              {
                data.map((post) => (
                  <article key={post.id} className="bg-white rounded-3xl p-6 shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all border border-gray-100">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 border-2 border-gray-100">
                          {post.user.name?.[0]?.toUpperCase()}
                        </div>

                        <div className="flex flex-col leading-tight">
                          <h3 className="text-sm font-semibold text-gray-900 leading-none">{post.user.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">{timeAgo(post.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${CATEGORY_STYLES[post.category]}`}>
                        {post.category}
                      </span>
                    </div>

                    {/* Body */}
                    <Link href={`/post/${post.id}`}>
                      {post.caption && (
                        <p className="text-sm leading-relaxed text-gray-700 mb-3">{post.caption}</p>
                      )}
                      {(post.placeName || post.address) && (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-sm mb-4">
                          <MapPin size={16} />
                          <span>{post.placeName || post.address}</span>
                        </div>
                      )}
                      {post.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4 rounded-2xl overflow-hidden">
                          {
                            post.images.map((img) => (
                              <div key={img.id} className="aspect-video">
                                <img src={img.url} className="h-full w-full object-cover" />
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <div
                          onMouseEnter={() => {
                            setShowReactionModel(post.id)
                          }}
                          onMouseLeave={() => {
                            setShowReactionModel("");
                          }}
                          className="relative flex flex-col"
                        >
                          <div className="absolute left-0">
                            {
                              showReactionModel === post.id &&
                              <ReactionModel reaction={post.votes[0]?.reaction} postId={post.id} handleAddReaction={handleAddReaction} disabledButton={handleReactionMutation.isPending} />
                            }
                          </div>
                          <div className="flex flex-row items-center gap-2">
                            {

                              post.votes[0]?.reaction === 'Like' ?
                                <button
                                  disabled={handleReactionMutation.isPending}
                                  className="flex items-center gap-1.5 rounded-full px-2 py-1.5 transition hover:bg-gray-100 disabled:opacity-50"
                                  onClick={() => {
                                    handleAddReaction({
                                      reactionAction: 'remove',
                                      reactionType: 'Like',
                                      postId: post.id
                                    })
                                  }}>
                                  <ThumbsUp size={20} color='#4f46e5' fill='#4f46e5' />
                                  <span className="text-sm font-medium text-gray-600">{post._count.votes}</span>
                                </button>

                                :

                                post.votes[0]?.reaction === 'Love' ?
                                  <button
                                    disabled={handleReactionMutation.isPending}
                                    className="flex items-center gap-1.5 rounded-full px-2 py-1.5 transition hover:bg-gray-100 disabled:opacity-50"
                                    onClick={() => {
                                      handleAddReaction({
                                        reactionAction: 'remove',
                                        reactionType: 'Love',
                                        postId: post.id
                                      })
                                    }}>
                                    <Heart size={20} color='#e11d48' fill='#e11d48' />
                                    <span className="text-sm font-medium text-gray-600">{post._count.votes}</span>
                                  </button>

                                  :


                                  post.votes[0]?.reaction === 'Fire' ?
                                    <button
                                      disabled={handleReactionMutation.isPending}
                                      className="flex items-center gap-1.5 rounded-full px-2 py-1.5 transition hover:bg-gray-100 disabled:opacity-50"
                                      onClick={() => {
                                        handleAddReaction({
                                          reactionAction: 'remove',
                                          reactionType: 'Fire',
                                          postId: post.id
                                        })
                                      }}>
                                      <Flame size={20} color='#f59e0b' fill='#f59e0b' />
                                      <span className="text-sm font-medium text-gray-600">{post._count.votes}</span>
                                    </button>

                                    :

                                    <button
                                      disabled={handleReactionMutation.isPending}
                                      className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"

                                      onClick={() => {
                                        handleAddReaction({
                                          reactionAction: 'add',
                                          reactionType: 'Like',
                                          postId: post.id
                                        })
                                      }}
                                    >

                                      <ThumbsUp size={20} />
                                      <span className="text-sm font-medium">{post._count.votes}</span>
                                    </button>

                            }
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-1.5 text-gray-500 px-2 py-1.5">
                          <MessageCircle size={20} />
                          <span className="text-sm font-medium">{post._count.comments}</span>
                        </div>
                      </div>

                      {/* decorative only — not wired to any handler */}
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                          <Send size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                          <Bookmark size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Comment input */}
                    <div className="mt-4 flex items-center gap-3 bg-gray-50 p-2 rounded-2xl">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                      <input
                        onChange={(e) => {
                          setComment({
                            id: post.id,
                            text: e.target.value
                          })
                        }}
                        value={comment.id === post.id ? comment.text : ""}
                        placeholder="Write a supportive comment..."
                        className="bg-transparent border-none focus:ring-0 text-sm flex-1"
                        type="text" />
                      <button className="text-emerald-700 font-bold text-sm px-4">
                        Post
                      </button>
                    </div>
                  </article>
                ))
              }
            </div>
            {/* ===== end posts feed ===== */}

          </div>

          {/* Right Sidebar — decorative content, not wired to real data */}
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
        </div>
      </main>

      {/* Mobile Navigation Bar — decorative */}
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
    </div>
  );
}

export default Page