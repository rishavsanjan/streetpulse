"use client"
import api from '@/lib/axios';
import { Post } from '@/types/post';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner';

const PostDetails = () => {
  const { postId } = useParams();
  const [commentText, setCommentText] = useState<string>("");
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
    onSuccess: () => {
      toast.success("Comment added successfully")
      setCommentText('');
    },
    onError: () => {
      toast.error("Something went weong")
    }
  })

  const data: Post = getPostDetails.data ?? {};

  if(getPostDetails.isPending) {
    return(
      <div>
        loading..
      </div>
    )
  }



  return (
    <div>
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