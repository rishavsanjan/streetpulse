"use client"
import CommentItem from '@/components/CommentItem';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Comment, Post } from '@/types/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner';
import { MessageCircle, Send } from 'lucide-react';

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

  function removeReplyCount(comments: Comment[], commentId: string): Comment[] {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          _count: {
            replies: comment._count.replies - 1
          }
        }
      }

      return {
        ...comment,
        replies: removeReplyCount(comment.replies, commentId)
      }
    })
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
    <div className="mx-auto flex w-full  flex-col space-y-6 px-4 pb-28 pt-6">
      <span className='text-xs font-medium uppercase tracking-wide text-slate-400'>page : {postId}</span>

      <div className='overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm'>
        <div className="flex items-center gap-3 px-4 pt-4">
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600'>
            {data.user.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight">
            <span className='text-sm font-semibold text-slate-900'>{data.user.name}</span>
            <span className='text-xs text-slate-400'>{data.address}</span>
          </div>
        </div>

        {data.caption && (
          <span className='block px-4 pt-3 text-sm leading-relaxed text-slate-700'>{data.caption}</span>
        )}

        {data.images.length > 0 && (
          <div className="mt-3 flex flex-row gap-0.5 ">
            {data.images.map((img) => (
              <div key={img.id} className=' shrink-0'>
                <img src={img.url} className='h-full w-full object-cover' />
              </div>
            ))}
          </div>
        )}

        <div className='px-4 pb-4 pt-4'>
          <div className='flex items-center gap-1.5 text-slate-500'>
            <MessageCircle size={16} />
            <span className='text-sm font-medium text-slate-600'>Comments</span>
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
    </div>
  );
}

export default PostDetails