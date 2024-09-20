import React from 'react';
import CastCard from './CastCard';

const RecursiveCastCard = ({ cast, onShowMoreReplies, isTopLevel = true, projectParentId }) => {
    const hasDirectReplies = cast.direct_replies && cast.direct_replies.length > 0;
    const isLastInBranch = !hasDirectReplies;

    return (
        <div>
            <CastCard
                cast={{ ...cast }}
                onShowMoreReplies={onShowMoreReplies}
                isLastInBranch={isLastInBranch}
                isTopLevel={isTopLevel}
                projectParentId={projectParentId}
            />

            {hasDirectReplies && (
                cast.direct_replies.map((reply, index) => (
                    <RecursiveCastCard
                        key={reply.hash}
                        cast={reply}
                        onShowMoreReplies={onShowMoreReplies}
                        isTopLevel={false}
                        projectParentId={projectParentId}
                    />
                ))
            )}
        </div>
    );
};

export default RecursiveCastCard