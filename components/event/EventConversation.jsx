import React, { useState, useEffect, useRef } from 'react';
import RecursiveCastCard from './RecursiveCastCard';
import { useProfileContext } from '../../context';
import { useNeynarContext } from '@neynar/react';
import { Loader2, ChevronDown } from 'lucide-react';

const EventConversation = ({ eventCastHash }) => {
    const [castData, setCastData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { profile } = useProfileContext()
    const { user } = useNeynarContext()
    const fetchedRef = useRef(false);

    const fetchMoreReplies = async (parentCastHash) => {
        if (!profile || !profile.farcasterId) {
            console.error('Profile or farcasterId is undefined');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/eventFeed?eventCastHash=${parentCastHash}&fId=${profile.farcasterId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }

            const newReplies = await response.json();
            setCastData(prevData => {
                const updateReplies = (cast) => {
                    if (cast.hash === parentCastHash) {
                        return {
                            ...cast,
                            direct_replies: [
                                ...(cast.direct_replies || []),
                                ...(newReplies.conversation.cast.direct_replies || [])
                            ],
                            replies: {
                                ...cast.replies,
                                count: cast.replies.count + newReplies.conversation.cast.direct_replies.length
                            }
                        };
                    }
                    return {
                        ...cast,
                        direct_replies: (cast.direct_replies || []).map(updateReplies)
                    };
                };

                return {
                    ...prevData,
                    conversation: {
                        ...prevData.conversation,
                        cast: updateReplies(prevData.conversation.cast)
                    }
                };
            });
        } catch (error) {
            console.error('Error fetching more replies:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const fetchEventFeed = async (cursor = null) => {
        if (!eventCastHash || !user) {
            console.error('eventCastHash or user profile.farcasterId is undefined');
            return;
        }

        setIsLoading(true);
        try {
            let url = `/api/eventFeed?eventCastHash=${eventCastHash}&fId=${profile.farcasterId}`;

            if (cursor) {
                url += `&cursor=${cursor}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCastData(prevData => {
                if (prevData && prevData.conversation && prevData.conversation.cast) {
                    return {
                        ...prevData,
                        conversation: {
                            ...prevData.conversation,
                            cast: {
                                ...prevData.conversation.cast,
                                direct_replies: [
                                    ...(prevData.conversation.cast.direct_replies || []),
                                    ...(data.conversation.cast.direct_replies || [])
                                ],
                            }
                        },
                        next: {
                            ...prevData.next,
                            cursor: data.next?.cursor || null
                        }
                    };
                }
                return data;
            });
        } catch (error) {
            console.error('Error fetching event feed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!castData && !fetchedRef.current) {
            //the ref keeps track of whether we've fetched the data so there are no duplicates
            fetchedRef.current = true;
            fetchEventFeed();
        }
    }, [eventCastHash, profile]);


    return (
        <div className='space-y-4 pt-4 relative'>
            {isLoading && (
                <div className="flex items-center justify-center bg-white bg-opacity-50 z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
            )}
            {castData && castData.conversation && castData.conversation.cast ? (
                <RecursiveCastCard
                    cast={castData.conversation.cast}
                    onShowMoreReplies={fetchMoreReplies}
                />
            ) : (
                null
            )}
            {castData && castData.next && castData.next.cursor && (
                <div className="flex items-center justify-center mt-4">
                    <button
                        onClick={() => fetchEventFeed(castData.next.cursor)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    >
                        <span>Load more</span>
                        <ChevronDown className="h-4 w-4" />
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventConversation