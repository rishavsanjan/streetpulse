"use client"
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { Post } from '@/types/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash } from 'lucide-react';
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner';

const PostDetails = () => {
  const { postId } = useParams<{ postId: string }>();
  const [commentText, setCommentText] = useState<string>("");
  const [isEditingComment, setIsEditingCommenting] = useState<string>("");
  const [updateCommentText, setUpdateCommentText] = useState<string>("");


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
        }
      };

      queryClient.setQueryData<Post>(["post-details", postId], (old) => {
        if (!old) return old;

        return {
          ...old,
          comments: [
            ...old.comments, newComment
          ]
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
          <div>
            {
              data.comments.map((comment) => (
                <div className='flex flex-col bg-green-300' key={comment.id}>
                  <span>{comment.user.name}</span>
                  {
                    comment.id === isEditingComment ?
                      <div className='flex flex-row space-x-4'>
                        <input
                          onChange={(e) => {
                            setUpdateCommentText(e.target.value);
                          }}
                        />
                        <button
                          className=''
                          onClick={() => {
                            setIsEditingCommenting("");
                            setUpdateCommentText("");

                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className=''
                          onClick={() => {
                            hanldleUpdateCommentMutation.mutate({
                              commentId: comment.id
                            })
                            
                          }}
                        >
                          Update
                        </button>

                      </div>
                      :
                      <span>{comment.text}</span>

                  }

                  {
                    comment.userId === user?.id &&
                    <button
                      className='flex-row flex'
                      onClick={() => {

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