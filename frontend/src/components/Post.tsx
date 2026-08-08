import { handleReaction, timeAgo } from '@/lib/post'
import { Post as PostType } from '@/types/post'
import { Bookmark, Flame, Heart, MapPin, MessageCircle, Send, ThumbsUp } from 'lucide-react'
import React, { useState } from 'react'
import ReactionModel from './ReactionModel'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient } from '@/lib/queryClient'
import Link from 'next/link'

interface Props {
    post: PostType
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

const CATEGORY_STYLES: Record<PostType['category'], string> = {
    General: 'bg-slate-100 text-slate-600',
    Nature: 'bg-emerald-50 text-emerald-600',
    Food: 'bg-orange-50 text-orange-600',
    Traffic: 'bg-amber-50 text-amber-700',
    Alert: 'bg-red-50 text-red-600',
    LostFound: 'bg-indigo-50 text-indigo-600',
};


const Post: React.FC<Props> = ({ post }) => {

    const { user, loading } = useAuth();
    const [showReactionModel, setShowReactionModel] = useState("");
    const [comment, setComment] = useState({
        id: "",
        text: ""
    });

    const handleReactionMutation = useMutation({
        mutationKey: ['reaction'],
        mutationFn: handleReaction,
        onSuccess: (_, variables) => {
            queryClient.setQueryData<PostType[]>(["feed"], (old) => {
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


    return (
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
    )
}

export default Post