"use client"
import CommentItem from '@/components/CommentItem';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Comment, Post } from '@/types/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner';

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
      <div>
        loading..
      </div>
    )
  }


  return (
    <div className="flex flex-col space-y-8">
      <span>page : {postId}</span>

      <div>
        <div className="flex flex-col">
          <span>{data.user.name}</span>
          <span>{data.address}</span>
        </div>

        <span>{data.caption}</span>

        <div className="flex flex-row">
          {data.images.map((img) => (
            <img key={img.id} src={img.url} />
          ))}
        </div>

        <div>
          <span>Comments</span>

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

      <div>
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />

        <button
          className="bg-gray-400"
          disabled={handleAddCommentMutation.isPending}
          onClick={() =>
            handleAddCommentMutation.mutate({
              parentId: null,
            })
          }
        >
          {handleAddCommentMutation.isPending
            ? "Commenting..."
            : "Comment"}
        </button>
      </div>
    </div>
  );
}

export default PostDetails