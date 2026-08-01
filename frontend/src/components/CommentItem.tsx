import { User } from "@/types/auth";
import EditngCommentModal from "./EditngCommentModal";
import { Comment } from "@/types/post";
import { Edit, Forward, Trash } from "lucide-react";
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
    <div className="ml-4 flex flex-col rounded bg-green-300 p-3">
      <span>{comment.user.name}</span>

      {comment.id === isEditingComment ? (
        <EditngCommentModal
          updateCommentText={updateCommentText}
          commentId={comment.id}
          setUpdateCommentText={setUpdateCommentText}
          setIsEditingCommenting={setIsEditingCommenting}
          handleUpdateComment={handleUpdateComment}
        />
      ) : (
        <span>{comment.text}</span>
      )}

      <div className="mt-2 flex gap-4">
        {comment.userId === user?.id && (
          <>
            <button
              onClick={() => {
                setUpdateCommentText(comment.text);
                setIsEditingCommenting(comment.id);
              }}
            >
              <Edit />
            </button>

            <button
              onClick={() =>
                handleDeleteCommentMutation.mutate({
                  commentId: comment.id,
                  parentId: comment.parentId
                })
              }
            >
              <Trash />
            </button>
          </>
        )}

        <button onClick={() => setIsReplying(comment.id)}>
          <Forward />
        </button>

        {comment._count.replies > 0 && (
          <button
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
            {expanded
              ? "Hide replies"
              : `View replies (${comment._count.replies})`}
          </button>
        )}
      </div>

      {isReplying === comment.id && (
        <ReplyModal
          commentId={comment.id}
          handleAddComment={handleAddComment}
          replyText={replyText}
          setReplyText={setReplyText}
          setIsReplying={setIsReplying}
        />
      )}

      {expanded && (
        <div className="mt-3 ml-6 border-l pl-4 space-y-3">
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
  );
}