import { useMutation } from "@tanstack/react-query";
import api from "./axios";

type ReactionType = "Like" |
  "Love" |
  "Fire"

type ReactionAction = "add" | "remove" | "update"

type ReactionVariables = {
  reactionAction: ReactionAction;
  reactionType: ReactionType;
  postId: string;
};


export const handleReaction = async ({ reactionAction, reactionType, postId }: ReactionVariables) => {
  if (reactionAction === "add") {
    const res = await api.post(`/reaction/${postId}`, {
      reaction: reactionType
    })
  } else {
    const res = await api.delete(`/reaction/${postId}`)
  }
}

