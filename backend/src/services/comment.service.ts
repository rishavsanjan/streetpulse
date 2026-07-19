import prisma from "../lib/prisma.js";
import { UserCommentSchema } from "../validators/comment.validator.js";

export const addCommentService = async (userId: string, postId: string, data: UserCommentSchema) => {

    if (data.parentId) {
        const parent = await prisma.comment.findUnique({ where: { id: data.parentId } })

        if (!parent || parent.postId !== postId) {
            throw new Error("Invalid parent comment");
        }
    }

    const comment = await prisma.comment.create({
        data: {
            parentId: data.parentId,
            text: data.text,
            userId,
            postId
        }
    })

    return comment;
}

export const getCommentService = async (postId: string) => {
    const comment = await prisma.comment.findMany({
        where: {
            postId
        },
        orderBy: {
            createdAt: 'asc'
        },
        skip: 0,
        take: 20
    })

    return comment;
}

export const updateCommentService = async (userId: string, commentId: string, data: UserCommentSchema) => {

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== userId) throw new Error("Not authorized to edit this comment");
    return await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            text: data.text
        }
    })
}

export const deleteCommentService = async (userId: string, commentId: string) => {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== userId) throw new Error("Not authorized to delete this comment");

    return prisma.comment.delete({ where: { id: commentId } });
}

