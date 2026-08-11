"use client"
import CommentItem from '@/components/CommentItem';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Comment, Post } from '@/types/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner';
import {
  MessageCircle, Send, Search, Bell, MapPin, Star, Share2, Bookmark,
  ArrowLeft, Heart, ChevronLeft, ChevronRight, Navigation, TrendingUp
} from 'lucide-react';

const PostDetails = () => {
  const { postId } = useParams<{ postId: string }>();
  const [commentText, setCommentText] = useState<string>("");
  const [isEditingComment, setIsEditingCommenting] = useState<string>("");
  const [updateCommentText, setUpdateCommentText] = useState<string>("");
  const [isReplying, setIsReplying] = useState("");
  const [replyText, setReplyText] = useState("");
  const [viewCommentReplies, setViewCommentReplies] = useState<string[]>([]);


  const { user } = useAuth();
  const queryClient = useQueryClient();
  const getPostDetails = useQuery({
    queryKey: ['post-details', postId],
    queryFn: async () => {
      const res = await api.get(`/post/${postId}`)

      console.log(res.data)

      return res.data.data
    }
  })

  function addNewReply(comments: Comment[], parentId: string,
    newComment: Comment
  ): Comment[] {

    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment, replies: [...comment.replies, newComment]
        }
      }

      return {
        ...comment,
        replies: addNewReply(comment.replies, parentId, newComment)
      }
    })
  }


  function addFetchedReply(comments: Comment[], parentId: string, replies: Comment[]): Comment[] {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment, replies: [...comment.replies, ...replies]
        }
      }

      return {
        ...comment,
        replies: addFetchedReply(comment.replies, parentId, replies)
      }
    })
  }

  function deleteComment(
    comments: Comment[],
    commentId: string,
    parentId: string | null
  ): Comment[] {
    return comments
      .filter((comment) => comment.id !== commentId)
      .map((comment) => ({
        ...comment,
        _count:
          comment.id === parentId
            ? {
              ...comment._count,
              replies: comment._count.replies - 1,
            }
            : comment._count,
        replies: deleteComment(
          comment.replies,
          commentId,
          parentId
        ),
      }));
  }



  const handleAddCommentMutation = useMutation({
    mutationKey: ['comment', postId],
    mutationFn: async ({ parentId }: { parentId: string | null }) => {
      const res = await api.post(`/comment/${postId}`, {
        parentId,
        text: parentId ? replyText : commentText
      });

      return res.data
    },
    onSuccess: (_, variables) => {
      toast.success("Comment added successfully")
      const newComment = {
        id: crypto.randomUUID(),
        postId,
        userId: user!.id,
        text: variables.parentId ? replyText : commentText,
        parentId: variables.parentId,
        user: {
          id: user!.id,
          name: user!.name,
          profile: null
        },
        replies: [],
        _count: {
          replies: 0
        }
      };

      queryClient.setQueryData<Post>(["post-details", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: variables.parentId === null ? [
            ...old.comments, newComment
          ] : addNewReply(old.comments, variables.parentId, newComment)
        }
      });
      if (variables.parentId !== null) {
        setViewCommentReplies((prev) =>
          variables.parentId !== null
            ? [...prev, variables.parentId]
            : prev
        );

      }
      setIsReplying("");

      setCommentText('');
    },
    onError: () => {
      toast.error("Something went weong")
    }
  })

  const handleDeleteCommentMutation = useMutation({
    mutationKey: ['comment-delete', postId],
    mutationFn: async ({ commentId , parentId}: { commentId: string, parentId : string | null}) => {
      const res = await api.delete(`/comment/${commentId}`);

      return res.data
    },
    onSuccess: (_, variables) => {


      queryClient.setQueryData<Post>(["post-details", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: deleteComment(old.comments, variables.commentId, variables.parentId)

        }

      });

      toast.success("Comment deleted successfully")
    },
    onError: () => {
      toast.error("Something went weong")
    }
  });

  const hanldleUpdateCommentMutation = useMutation({
    mutationKey: ['comment-update', postId],
    mutationFn: async ({ commentId }: { commentId: string }) => {
      const res = await api.patch(`/comment/${commentId}`, {
        text: updateCommentText
      });

      return res.data
    },
    onSuccess: (_, variables) => {


      queryClient.setQueryData<Post>(["post-details", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: [
            ...old.comments.map((comment) => {
              if (comment.id === variables.commentId) {
                return {
                  ...comment,
                  text: updateCommentText
                }
              }

              return comment;
            })
          ]
        }
      });
      toast.success("Comment updated successfully")
      setUpdateCommentText("");
      setIsEditingCommenting("");
    },
    onError: () => {
      toast.error("Something went weong")
    }
  });

  const handleGetRepliesMutation = useMutation<Comment[], Error, { parentId: string }>({
    mutationKey: ['replies'],
    mutationFn: async ({ parentId }: { parentId: string }) => {
      const res = await api.get(`/comment/replies/${parentId}`);
      console.log(res.data)
      return res.data.data as Comment[]
    },
    onSuccess: (replies, variables) => {
      queryClient.setQueryData<Post>(["post-details", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: addFetchedReply(old.comments, variables.parentId, replies)
        }
      });

      setViewCommentReplies(prev => ([...prev, variables.parentId]))

    }
  })

  const handleAddComment = (parentId: string | null) => {
    handleAddCommentMutation.mutate({
      parentId: parentId
    })
  }

  const handleUpdateComment = (commentId: string) => {
    hanldleUpdateCommentMutation.mutate({
      commentId: commentId
    })
  }



  const handleGetReplies = (parentId: string) => {

    handleGetRepliesMutation.mutate({
      parentId
    })
  }





  const data: Post = getPostDetails.data ?? {};

  if (getPostDetails.isPending) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <span className='h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600' />
      </div>
    )
  }


  return (
    <div className="bg-[#f4fbf4] min-h-screen text-[#161d19]">
      

      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 pb-28">

        {/* Back nav — decorative */}
        <div className="mb-6 flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-700 transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-semibold">Back to Neighborhood</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main content */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Hero — uses real post image/address when available, otherwise skipped */}
            {data.images && data.images.length > 0 && (
              <section className="relative rounded-3xl overflow-hidden shadow-md">
                <div
                  className="w-full h-[320px] md:h-[420px] bg-cover bg-center"
                  style={{ backgroundImage: `url('${data.images[0].url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                      <Star size={12} fill="white" />
                      Featured Post
                    </span>
                  </div>
                  {data.caption && (
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-md">{data.caption}</h2>
                  )}
                  {data.address && (
                    <p className="text-white/90 flex items-center gap-1.5 text-base">
                      <MapPin size={18} />
                      {data.address}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* ===== Post Story card — structure/logic unchanged from original ===== */}
            <div className='overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm'>
              <div className="flex items-center justify-between gap-3 px-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 border-2 border-gray-100'>
                    {data.user.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className='text-sm font-semibold text-slate-900'>{data.user.name}</span>
                    <span className='text-xs text-slate-400'>{data.address}</span>
                  </div>
                </div>
                {/* decorative only — not wired to any handler */}
                <button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors">
                  Follow
                </button>
              </div>

              {data.caption && (
                <span className='block px-6 pt-4 text-sm leading-relaxed text-slate-700'>{data.caption}</span>
              )}

              {data.images.length > 0 && (
                <div className="mt-4 flex flex-row gap-0.5 px-6">
                  {data.images.map((img) => (
                    <div key={img.id} className='shrink-0 rounded-xl overflow-hidden'>
                      <img src={img.url} className='h-48 w-48 object-cover' />
                    </div>
                  ))}
                </div>
              )}

              <div className='px-6 pb-6 pt-6'>
                <div className='flex items-center gap-1.5 text-slate-500 pb-4 border-b border-gray-100'>
                  <MessageCircle size={18} />
                  <span className='text-sm font-semibold text-slate-600'>Comments ({data.comments.length})</span>
                </div>

                <div className="mt-4 flex flex-col space-y-4">
                  {data.comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      user={user}
                      isEditingComment={isEditingComment}
                      updateCommentText={updateCommentText}
                      setUpdateCommentText={setUpdateCommentText}
                      setIsEditingCommenting={setIsEditingCommenting}
                      handleUpdateComment={handleUpdateComment}
                      handleDeleteCommentMutation={handleDeleteCommentMutation}
                      isReplying={isReplying}
                      setIsReplying={setIsReplying}
                      replyText={replyText}
                      setReplyText={setReplyText}
                      handleAddComment={handleAddComment}
                      viewCommentReplies={viewCommentReplies}
                      setViewCommentReplies={setViewCommentReplies}
                      handleGetReplies={handleGetReplies}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* ===== end post story card ===== */}

          </div>

          {/* Side panels — decorative, not wired to real data beyond what's already on `data` */}
          <aside className="lg:col-span-4 flex flex-col gap-8">

            {data.address && (
              <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="text-lg font-semibold">Where it's happening</h4>
                  <MapPin size={20} className="text-gray-500" />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Navigation size={18} />
                    {data.address}
                  </p>
                </div>
              </section>
            )}

            <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <h4 className="text-lg font-semibold mb-6">Neighbor Activity</h4>
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                    <TrendingUp size={18} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h5 className="text-sm font-semibold">Discussion is picking up</h5>
                    <p className="text-xs text-gray-400">{data.comments.length} comments so far</p>
                  </div>
                </div>
              </div>
              <button className="mt-6 w-full text-center text-emerald-700 font-semibold text-sm hover:underline">See Community Feed</button>
            </section>

            <section className="flex flex-col gap-3">
              <button className="w-full bg-emerald-700 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-semibold flex items-center justify-center gap-2 active:scale-95">
                <Heart size={20} />
                Show Your Support
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white border border-gray-200 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-gray-50 transition-all">
                  <Share2 size={18} className="text-emerald-700" />
                  <span className="text-xs">Share Post</span>
                </button>
                <button className="bg-white border border-gray-200 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-gray-50 transition-all">
                  <Bookmark size={18} className="text-emerald-700" />
                  <span className="text-xs">Save Post</span>
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* ===== Comment input — logic unchanged from original ===== */}
      <div className='fixed inset-x-0 bottom-0 z-20 border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-sm'>
        <div className='mx-auto flex w-full max-w-xl items-center gap-2'>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder='Add a comment...'
            className='flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
          />

          <button
            className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            disabled={handleAddCommentMutation.isPending}
            onClick={() =>
              handleAddCommentMutation.mutate({
                parentId: null,
              })
            }
          >
            {handleAddCommentMutation.isPending
              ? "Commenting..."
              : (
                <>
                  <span className='hidden sm:inline'>Comment</span>
                  <Send size={16} className='sm:hidden' />
                </>
              )}
          </button>
        </div>
      </div>

      {/* Mobile bottom nav — decorative */}
      <nav className="md:hidden fixed bottom-16 left-0 right-0 backdrop-blur-md bg-white/90 border-t border-gray-200 z-10 px-6 py-2">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <ChevronLeft size={20} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-emerald-700">
            <TrendingUp size={20} />
            <span className="text-[10px] font-bold">Explore</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500">
            <ChevronRight size={20} />
            <span className="text-[10px] font-bold">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default PostDetails