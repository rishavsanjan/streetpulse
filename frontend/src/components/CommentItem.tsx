import { User } from "@/types/auth";
import EditngCommentModal from "./EditngCommentModal";
import { Comment } from "@/types/post";
import { Edit, Forward, Trash, ChevronDown, ChevronUp } from "lucide-react";
import ReplyModal from "./ReplyModal";

type Props = {
  comment: Comment;
  user: User | null;

  isEditingComment: string | null;
  updateCommentText: string;
  setUpdateCommentText: React.Dispatch<React.SetStateAction<string>>;
  setIsEditingCommenting: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateComment: (commentId: string) => void;

  handleDeleteCommentMutation: any;

  isReplying: string | null;
  setIsReplying: React.Dispatch<React.SetStateAction<string>>;

  replyText: string;
  setReplyText: React.Dispatch<React.SetStateAction<string>>;
  handleAddComment: (parentId: string | null) => void;
  handleGetReplies: (parentId: string) => void;

  viewCommentReplies: string[];
  setViewCommentReplies: React.Dispatch<
    React.SetStateAction<string[]>
  >;
};

export default function CommentItem({
  comment,
  user,
  isEditingComment,
  updateCommentText,
  setUpdateCommentText,
  setIsEditingCommenting,
  handleUpdateComment,
  handleDeleteCommentMutation,
  isReplying,
  setIsReplying,
  replyText,
  setReplyText,
  handleAddComment,
  viewCommentReplies,
  setViewCommentReplies,
  handleGetReplies
}: Props) {
  const expanded = viewCommentReplies.includes(comment.id);

  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
        {comment.user.name?.[0]?.toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="rounded-2xl bg-gray-50 px-4 py-2.5">
          <span className="block text-sm font-semibold text-gray-900">{comment.user.name}</span>

          {comment.id === isEditingComment ? (
            <div className="mt-1">
              <EditngCommentModal
                updateCommentText={updateCommentText}
                commentId={comment.id}
                setUpdateCommentText={setUpdateCommentText}
                setIsEditingCommenting={setIsEditingCommenting}
                handleUpdateComment={handleUpdateComment}
              />
            </div>
          ) : (
            <span className="block text-sm text-gray-700 leading-relaxed mt-0.5">{comment.text}</span>
          )}
        </div>

        <div className="mt-1.5 flex items-center gap-4 px-1">
          {comment.userId === user?.id && (
            <>
              <button
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-emerald-700 transition-colors"
                onClick={() => {
                  setUpdateCommentText(comment.text);
                  setIsEditingCommenting(comment.id);
                }}
              >
                <Edit size={14} />
                Edit
              </button>

              <button
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                onClick={() =>
                  handleDeleteCommentMutation.mutate({
                    commentId: comment.id,
                    parentId: comment.parentId
                  })
                }
              >
                <Trash size={14} />
                Delete
              </button>
            </>
          )}

          <button
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-emerald-700 transition-colors"
            onClick={() => setIsReplying(comment.id)}
          >
            <Forward size={14} />
            Reply
          </button>

          {comment._count.replies > 0 && (
            <button
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
              onClick={() => {
                if (expanded) {
                  setViewCommentReplies(prev => prev.filter((id) => id !== comment.id))
                  return;
                }

                if (comment.replies.length > 0) {
                  setViewCommentReplies((prev) => [...prev, comment.id]);
                  return;

                }
                handleGetReplies(comment.id)


              }

              }
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded
                ? "Hide replies"
                : `View replies (${comment._count.replies})`}
            </button>
          )}
        </div>

        {isReplying === comment.id && (
          <div className="mt-2">
            <ReplyModal
              commentId={comment.id}
              handleAddComment={handleAddComment}
              replyText={replyText}
              setReplyText={setReplyText}
              setIsReplying={setIsReplying}
            />
          </div>
        )}

        {expanded && (
          <div className="mt-3 ml-2 border-l-2 border-gray-100 pl-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                user={user}
                isEditingComment={isEditingComment}
                updateCommentText={updateCommentText}
                setUpdateCommentText={setUpdateCommentText}
                setIsEditingCommenting={setIsEditingCommenting}
                handleUpdateComment={handleUpdateComment}
                handleDeleteCommentMutation={handleDeleteCommentMutation}
                isReplying={isReplying}
                setIsReplying={setIsReplying}
                replyText={replyText}
                setReplyText={setReplyText}
                handleAddComment={handleAddComment}
                viewCommentReplies={viewCommentReplies}
                setViewCommentReplies={setViewCommentReplies}
                handleGetReplies={handleGetReplies}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}