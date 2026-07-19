import prisma from "../lib/prisma.js";
import { CreatePostSchema } from "../validators/post.validator.js";

export const createPostService = async (userId: string, data: CreatePostSchema) => {
    const post = await prisma.post.create({
        data: {
            userId,
            ...data
        }
    })

    return post;
}


export const deletePostService = async (postId: string, userId: string) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })

    if (!post) {
        throw new Error("Post nott found")
    }

    if (post.userId != userId) {
        throw new Error("Not authenticated to delete the post")
    }

    const deletedPost = await prisma.post.delete({
        where: {
            id: postId
        }
    })

    return deletedPost;
}

export const postDetailService = async (postId: string) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },

        include: {
            _count: { select: { comments: true, votes: true } },
            images: true,
            videos: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    profile: {
                        select: {
                            avatar: true
                        }
                    }
                }
            }
        }
    })

    if (!post) {
        throw new Error("Post not found")
    }

    return post;
}


export const feedPostsService = async (userId: string) => {
    const posts = await prisma.post.findMany({
        include: {
            _count: { select: { comments: true, votes: true } },
            images: true,
            videos: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    profile: {
                        select: {
                            avatar: true
                        }
                    }
                }
            },
            votes: {
                where: {
                    userId
                }
            }
        }
    })

    return posts;
}   