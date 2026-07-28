"use client"
import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

const PostDetails = () => {
    const {postId} = useParams();

    const getPostDetails = useQuery({
        queryKey:['post-details', postId],
        queryFn: async() => {
            const res = await api.get(`/post/${postId}`)

            console.log(res.data)

            return res.data.data 
        }
    })

    

  return (
    <div>page : {postId}</div>
  )
}

export default PostDetails