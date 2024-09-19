import React from 'react';
import CastCard from './CastCard';

const RecursiveCastCard = ({ cast, onShowMoreReplies, isTopLevel = true }) => {
    const hasDirectReplies = cast.direct_replies && cast.direct_replies.length > 0;
    const isLastInBranch = !hasDirectReplies;

    return (
        <div>
            <CastCard
                cast={{ ...cast }}
                onShowMoreReplies={onShowMoreReplies}
                isLastInBranch={isLastInBranch}
                isTopLevel={isTopLevel}
            />

            {hasDirectReplies && (
                cast.direct_replies.map((reply, index) => (
                    <RecursiveCastCard
                        key={reply.hash}
                        cast={reply}
                        onShowMoreReplies={onShowMoreReplies}
                        isTopLevel={false}
                    />
                ))
            )}
        </div>
    );
};

export default RecursiveCastCard