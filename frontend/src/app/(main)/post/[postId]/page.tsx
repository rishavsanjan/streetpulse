"use client"
import CommentItem from '@/components/CommentItem';
import EditngCommentModal from '@/components/EditngCommentModal';
import ReplyModal from '@/components/ReplyModal';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Comment, Post } from '@/types/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Forward, Trash } from 'lucide-react';
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

  function addReply(comments: Comment[], parentId: string,
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
        replies: addReply(comment.replies, parentId, newComment)
      }
    })
  }

  const handleAddCommentMutation = useMutation({
    mutationKey: ['comment', postId],
    mutationFn: async ({ parentId }: { parentId: string | null }) => {
      const res = await api.post(`/comment/${postId}`, {
        parentId,
        text: commentText
      });

      return res.data
    },
    onSuccess: (_, variables) => {
      toast.success("Comment added successfully")
      const newComment = {
        id: crypto.randomUUID(),
        postId,
        userId: user!.id,
        text: commentText,
        parentId: variables.parentId,
        user: {
          id: user!.id,
          name: user!.name,
          profile: null
        },
        replies: [],
        _count :{
          replies : 0
        }
      };

      queryClient.setQueryData<Post>(["post-details", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: variables.parentId === null ? [
            ...old.comments, newComment
          ] : addReply(old.comments, variables.parentId, newComment)
        }
      });

      setIsReplying("");

      setCommentText('');
    },
    onError: () => {
      toast.error("Something went weong")
    }
  })

  const handleDeleteCommentMutation = useMutation({
    mutationKey: ['comment-delete', postId],
    mutationFn: async ({ commentId }: { commentId: string }) => {
      const res = await api.delete(`/comment/${commentId}`);

      return res.data
    },
    onSuccess: (_, variables) => {


      queryClient.setQueryData<Post>(["post-details", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: [
            ...old.comments.filter((comment) => comment.id !== variables.commentId)
          ]
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