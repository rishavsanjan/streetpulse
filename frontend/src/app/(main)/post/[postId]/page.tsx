"use client"
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
        replies: []
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
    <div className='space-y-8 flex flex-col' >
      <span> page : {postId}</span>
      <div>
        <div className='flex flex-col'>
          <span>{data.user.name}</span><span>{data.address}</span>


        </div>
        <span>{data.caption}</span>
        <div className='flex flex-row'>
          {
            data.images.map((img) => (
              <div key={img.id}>
                <img src={img.url} />
              </div>
            ))
          }
        </div>
        <div>
          <span>comments</span>
          <div className='flex flex-col space-y-4'>
            {
              data.comments.map((comment) => (
                <div className='flex flex-col bg-green-300' key={comment.id}>
                  <span>{comment.user.name}</span>
                  {
                    comment.id === isEditingComment ?
                      <EditngCommentModal
                        updateCommentText={updateCommentText}
                        commentId={comment.id}
                        setUpdateCommentText={setUpdateCommentText}
                        setIsEditingCommenting={setIsEditingCommenting}
                        handleUpdateComment={handleUpdateComment}
                      />
                      :
                      <span>{comment.text}</span>

                  }
                  <div className='flex flex-row space-x-4'>
                    {
                      comment.userId === user?.id &&
                      <button
                        className='flex-row flex'
                        onClick={() => {
                          setUpdateCommentText(comment.text)
                          setIsEditingCommenting(comment.id)
                        }}
                      >
                        <Edit />
                        Edit
                      </button>
                    }
                    {
                      comment.userId === user?.id &&
                      <button
                        className='flex-row flex'
                        onClick={() => {
                          handleDeleteCommentMutation.mutate({
                            commentId: comment.id
                          })
                        }}
                      >
                        <Trash />
                        Delete
                      </button>
                    }

                    {
                      comment.userId === user?.id &&
                      <button
                        className='flex-row flex'
                        onClick={() => {
                          setIsReplying(comment.id)
                        }}
                      >
                        <Forward />
                        Reply
                      </button>
                    }


                  </div>
                  {
                    
                  }
                  {
                    isReplying === comment.id &&
                    <ReplyModal
                      commentId={comment.id}
                      handleAddComment={handleAddComment}
                      replyText={replyText}
                      setIsReplying={setIsReplying}
                      setReplyText={setReplyText}
                    />

                  }


                </div>
              ))
            }
          </div>
        </div>
      </div>
      <div>
        <input
          onChange={(e) => {
            setCommentText(e.target.value)
          }}
        />
        <button
          disabled={handleAddCommentMutation.isPending}
          onClick={() => {
            handleAddCommentMutation.mutate({
              parentId: null
            })
          }}
          className='bg-gray-400'>
          {
            <span>
              {
                handleAddCommentMutation.isPending ? 'Commenting...' :
                  'Comment'
              }
            </span>
          }
        </button>
      </div>
    </div>


  )
}

export default PostDetails