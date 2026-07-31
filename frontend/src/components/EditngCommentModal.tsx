import React, { SetStateAction } from 'react'

interface Props {
    setUpdateCommentText: React.Dispatch<SetStateAction<string>>,
    setIsEditingCommenting: React.Dispatch<SetStateAction<string>>,
    handleUpdateComment: (commentId: string) => void
    commentId: string
    updateCommentText:string
}

const EditngCommentModal: React.FC<Props> = ({ setUpdateCommentText,
    setIsEditingCommenting,
    handleUpdateComment,
    commentId,
    updateCommentText
}) => {
    return (
        <div className='flex flex-row space-x-4'>
            <input
                value={updateCommentText}
                onChange={(e) => {
                    setUpdateCommentText(e.target.value);
                }}
            />
            <button
                className=''
                onClick={() => {
                    setIsEditingCommenting("");
                    setUpdateCommentText("");

                }}
            >
                Cancel
            </button>
            <button
                className=''
                onClick={() => {
                    handleUpdateComment(commentId);

                }}
            >
                Update
            </button>

        </div>
    )
}

export default EditngCommentModal