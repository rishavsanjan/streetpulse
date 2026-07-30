import { Flame, Heart, ThumbsUp } from 'lucide-react'
import React from 'react'

type ReactionType = "Like" |
    "Love" |
    "Fire"

type ReactionAction = "add" | "remove" | "update"

type ReactionVariables = {
    reactionAction: ReactionAction;
    reactionType: ReactionType;
    postId: string;
};


interface Props {
    reaction: ReactionType,
    postId: string,
    handleAddReaction: ({ reactionAction, reactionType, postId }: ReactionVariables) => void
    disabledButton: boolean
}

const ReactionModel: React.FC<Props> = ({ reaction, postId, handleAddReaction, disabledButton }) => {
    return (
        <div className='flex flex-row'>
            {

                reaction === 'Like' ?
                    <button
                        disabled={disabledButton}
                        onClick={() => {

                            handleAddReaction({
                                reactionAction: 'remove',
                                reactionType: 'Like',
                                postId: postId
                            })
                        }}>
                        <ThumbsUp color='blue' fill='blue' />
                    </button>

                    :

                    <button
                        disabled={disabledButton}
                        onClick={() => {
                            const reactionAction = reaction === "Fire" || reaction === "Love" || reaction === "Like" ? "update" : "add"
                            handleAddReaction({
                                reactionAction: reactionAction,
                                reactionType: 'Like',
                                postId: postId
                            })
                        }}
                    >

                        <ThumbsUp />
                    </button>

            }

            {
                reaction === 'Love' ?
                    <button
                        disabled={disabledButton}
                        onClick={() => {
                            handleAddReaction({
                                reactionAction: 'remove',
                                reactionType: 'Love',
                                postId: postId
                            })
                        }}>
                        <Heart color='red' fill='red' />
                    </button>

                    :

                    <button
                        disabled={disabledButton}
                        onClick={() => {
                            const reactionAction = reaction === "Fire" || reaction === "Like" || reaction === "Love" ? "update" : "add"
                            handleAddReaction({
                                reactionAction: reactionAction,
                                reactionType: 'Love',
                                postId: postId
                            })
                        }}
                    >

                        <Heart />
                    </button>

            }

            {
                reaction === 'Fire' ?
                    <button
                        disabled={disabledButton}
                        onClick={() => {
                            handleAddReaction({
                                reactionAction: 'remove',
                                reactionType: 'Fire',
                                postId: postId
                            })
                        }}>
                        <Flame color='yellow' fill='yellow' />
                    </button>

                    :

                    <button
                        disabled={disabledButton}
                        onClick={() => {
                            const reactionAction = reaction === "Like" || reaction === "Love" || reaction === "Fire" ? "update" : "add"
                            handleAddReaction({
                                reactionAction: reactionAction,
                                reactionType: 'Fire',
                                postId: postId
                            })
                        }}
                    >

                        <Flame />
                    </button>

            }


        </div>
    )
}

export default ReactionModel