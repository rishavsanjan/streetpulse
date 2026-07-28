"use client"

import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/axios';
import { queryClient } from '@/lib/queryClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Flame, Heart, ThumbsDown, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
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


const Page = () => {
  const { user, loading } = useAuth();
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
    mutationFn: async ({ reactionAction, reactionType, postId }: ReactionVariables) => {
      if (reactionAction === "add") {
        const res = await api.post(`/reaction/${postId}`, {
          reaction: reactionType
        })


      } else {
        const res = await api.delete(`/reaction/${postId}`)
      }
    },
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






  const data: Post[] = getPosts.data ?? [];

  console.log(data)

  if (loading) return <p>Loading...</p>;




  return (
    <div className='flex flex-col space-y-8'>
      <div>
        <h1>Feed</h1>
        <p>{user?.name}</p>
        <p>{user?.email}</p>
      </div>
      <div>
        {
          data.map((post) => (
            <div key={post.id} className='bg-red-500'>
              <div className='flex flex-col'>
                <span>{post.user.name}</span><span>{post.address}</span>


              </div>
              <Link href={`/post/${post.id}`}>
                <span>{post.caption}</span>
                <div className='flex flex-row'>
                  {
                    post.images.map((img) => (
                      <div key={img.id}>
                        <img src={img.url} />
                      </div>
                    ))
                  }
                </div>
              </Link>

              <div >
                {

                  post.votes[0]?.reaction === 'Like' ?
                    <button onClick={() => {
                      handleReactionMutation.mutate({
                        reactionAction: 'remove',
                        reactionType: 'Like',
                        postId: post.id
                      })
                    }}>
                      <ThumbsUp color='blue' fill='blue' />
                    </button>

                    :

                    <button
                      onClick={() => {
                        handleReactionMutation.mutate({
                          reactionAction: 'add',
                          reactionType: 'Like',
                          postId: post.id
                        })
                      }}
                    >

                      <ThumbsUp />
                    </button>

                }

                {
                  post.votes[0]?.reaction === 'Love' ?
                    <button onClick={() => {
                      handleReactionMutation.mutate({
                        reactionAction: 'remove',
                        reactionType: 'Love',
                        postId: post.id
                      })
                    }}>
                      <Heart color='red' fill='red' />
                    </button>

                    :

                    <button
                      onClick={() => {
                        handleReactionMutation.mutate({
                          reactionAction: 'add',
                          reactionType: 'Love',
                          postId: post.id
                        })
                      }}
                    >

                      <Heart />
                    </button>

                }

                {
                  post.votes[0]?.reaction === 'Fire' ?
                    <button onClick={() => {
                      handleReactionMutation.mutate({
                        reactionAction: 'remove',
                        reactionType: 'Fire',
                        postId: post.id
                      })
                    }}>
                      <Flame color='yellow' fill='yellow' />
                    </button>

                    :

                    <button
                      onClick={() => {
                        handleReactionMutation.mutate({
                          reactionAction: 'add',
                          reactionType: 'Fire',
                          postId: post.id
                        })
                      }}
                    >

                      <Flame />
                    </button>

                }
                <div>
                  {post._count.votes}
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