"use client"

import ReactionModel from '@/components/ReactionModel';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { handleReaction } from '@/lib/post';
import { queryClient } from '@/lib/queryClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Flame, Heart, MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
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

const Page = () => {
  const { user, loading } = useAuth();
  const [showReactionModel, setShowReactionModel] = useState("");
  console.log(user)
  const queryClient = useQueryClient();
  const getPosts = useQuery({
    queryFn: async () => {
      const res = await api.get("/post");
      console.log(res.data)
      return res.data.data as Post[];
    },
    queryKey: ['feed'],

  })




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
    <div className='mx-auto flex w-full  flex-col space-y-6 px-4 pt-6'>
      

      <div className='flex flex-col gap-4 pb-20'>
        {
          data.map((post) => (
            <div key={post.id} className='overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm'>

              {/* Header */}
              <div className='flex items-center justify-between px-4 pt-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600'>
                    {post.user.name?.[0]?.toUpperCase()}
                  </div>
                  <div className='flex flex-col leading-tight'>
                    <span className='text-sm font-semibold text-slate-900'>{post.user.name}</span>
                    <span className='text-xs text-slate-400'>{post.address}</span>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${CATEGORY_STYLES[post.category]}`}>
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <Link href={`/post/${post.id}`} className=''>
                {post.caption && (
                  <p className='px-4 pt-3 text-sm leading-relaxed text-slate-700'>{post.caption}</p>
                )}
                {post.images.length > 0 && (
                  <div className='mt-3 flex flex-row space-x-4'>
                    {
                      post.images.map((img) => (
                        <div key={img.id} className=''>
                          <img src={img.url} className='h-96 w-96 object-cover' />
                        </div>
                      ))
                    }
                  </div>
                )}
              </Link>

              {/* Actions */}
              <div className='flex items-center justify-between px-4 py-3'>
                <div
                  onMouseEnter={() => {
                    setShowReactionModel(post.id)
                  }}
                  onMouseLeave={() => {
                    setShowReactionModel("");
                  }}
                  className='relative flex flex-col'

                >
                  <div className='absolute  left-0'>
                    {
                      showReactionModel === post.id &&
                      <ReactionModel reaction={post.votes[0]?.reaction} postId={post.id} handleAddReaction={handleAddReaction} disabledButton={handleReactionMutation.isPending} />
                    }
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    {

                      post.votes[0]?.reaction === 'Like' ?
                        <button
                          disabled={handleReactionMutation.isPending}
                          className='flex items-center justify-center rounded-full p-1.5 transition hover:bg-slate-100 disabled:opacity-50'
                          onClick={() => {
                            handleAddReaction({
                              reactionAction: 'remove',
                              reactionType: 'Like',
                              postId: post.id
                            })
                          }}>
                          <ThumbsUp size={20} color='#4f46e5' fill='#4f46e5' />
                        </button>

                        :

                        post.votes[0]?.reaction === 'Love' ?
                          <button
                            disabled={handleReactionMutation.isPending}
                            className='flex items-center justify-center rounded-full p-1.5 transition hover:bg-slate-100 disabled:opacity-50'
                            onClick={() => {
                              handleAddReaction({
                                reactionAction: 'remove',
                                reactionType: 'Love',
                                postId: post.id
                              })
                            }}>
                            <Heart size={20} color='#e11d48' fill='#e11d48' />
                          </button>

                          :


                          post.votes[0]?.reaction === 'Fire' ?
                            <button
                              disabled={handleReactionMutation.isPending}
                              className='flex items-center justify-center rounded-full p-1.5 transition hover:bg-slate-100 disabled:opacity-50'
                              onClick={() => {
                                handleAddReaction({
                                  reactionAction: 'remove',
                                  reactionType: 'Fire',
                                  postId: post.id
                                })
                              }}>
                              <Flame size={20} color='#f59e0b' fill='#f59e0b' />
                            </button>

                            :

                            <button
                              disabled={handleReactionMutation.isPending}
                              className='flex items-center justify-center rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50'

                              onClick={() => {
                                handleAddReaction({
                                  reactionAction: 'add',
                                  reactionType: 'Like',
                                  postId: post.id
                                })
                              }}
                            >

                              <ThumbsUp size={20} />
                            </button>

                    }
                    <span className='text-sm text-slate-500'>
                      {post._count.votes}
                    </span>
                  </div>




                </div>
                <div className='flex flex-row items-center gap-1.5 text-slate-500'>
                  <MessageCircle size={20} />
                  <span className='text-sm'>{post._count.comments}</span>
                </div>
              </div>
            </div>

          ))
        }
      </div>


    </div>
  );
}

export default Page