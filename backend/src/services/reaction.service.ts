import prisma from "../lib/prisma.js";
import {  UserReactionSchema } from "../validators/reaction.validator.js";

export const addReactionService = async (userId: string, data: UserReactionSchema, postId:string) => {
   
    const vote = await prisma.vote.upsert({
        where: {
            userId_postId: {
                userId,
                postId
            }
        },
        update: {
            reaction: data.reaction
        },
        create: {
            userId: userId,
            postId: postId,
            reaction: data.reaction
        }
    })

    return vote;

}

export const removeReactionService = async (userId: string, postId:string) => {
    
    const vote = await prisma.vote.delete({
        where:{
            userId_postId:{
                userId,
                postId
            }
        }
    })


    return vote;

}

export const updateReactionService = async (userId: string, postId:string, reaction : 'Like' | 'Love' | 'Fire') => {
    
    const vote = await prisma.vote.update({
        where:{
            userId_postId:{
                userId,
                postId
            }
        },
        data:{
            reaction:reaction
        }
    })


    return vote;

}