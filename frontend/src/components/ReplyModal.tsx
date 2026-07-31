import React, { SetStateAction } from 'react'

interface Props {
    setReplyText: React.Dispatch<SetStateAction<string>>,
    setIsReplying: React.Dispatch<SetStateAction<string>>,
    replyText : string,
    handleAddComment : (parentId:string | null) => void
    commentId : string
}

const ReplyModal:React.FC<Props> = ({replyText, setReplyText, setIsReplying, handleAddComment, commentId}) => {
    return (
        <div className='flex flex-col space-y-2'>

            <input
                placeholder='Add text'
                onChange={(e) => {
                    setReplyText(e.target.value)
                }}
                value={replyText}
            />
            <div className='flex flex-row space-x-4'>
                <button
                    onClick={() => {
                        handleAddComment(commentId ?? null);
                    }}
                >
                    Reply
                </button>
                <button
                    onClick={() => {
                        setIsReplying("");
                    }}
                >
                    Cancel
                </button>
            </div>

        </div>
    )
}

export default ReplyModal