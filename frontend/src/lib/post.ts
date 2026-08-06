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

export function timeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);

  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

