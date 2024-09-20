import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, Share, ChevronDown, Check, Trash, Save } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useNeynarContext } from '@neynar/react';
import { toast } from 'sonner';
import CastMainCardReply from './CastMainCardReply';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import CastRenderEmbed from './CastRenderEmbed';
import { v4 as uuidv4 } from 'uuid';
import CastSubCardReply from './CastSubCardReply';
import { gql, useMutation } from '@apollo/client';

const CastCard = ({ cast, onShowMoreReplies, isLastInBranch, isTopLevel, projectParentId }) => {
    const { author, text, timestamp, reactions, replies, hash, viewer_context, embeds = [], frames = [] } = cast;
    const [isLinkCopied, setIsLinkCopied] = useState(false)
    const [likes, setLikes] = useState(cast.reactions.likes_count)
    const { user } = useNeynarContext()
    const framesUrls = frames.map(frame => frame.frames_url)
    const filteredEmbeds =
        embeds.filter(embed => !framesUrls.includes(embed.url))
    const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

    const deleteCast = async () => {
        if (!user || !user.signer_uuid) {
            console.error('User or signer_uuid not available');
            return;
        }

        try {
            const response = await fetch(`/api/eventCard?eventCastHash=${hash}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    signerUuid: user.signer_uuid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete cast');
            }

            toast.success('Deleted cast')
        } catch (error) {
            console.error('Error deleting cast:', error);
            toast.error('Error deleting cast.')
        }
    };

    const likeCast = async () => {
        if (!user || !user.signer_uuid) {
            console.error('User or signer_uuid not available');
            return;
        }

        try {
            const response = await fetch('/api/eventCard', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reaction_type: 'like',
                    signer_uuid: user.signer_uuid,
                    target: hash,
                    target_author_fid: author.fid,
                    idem: uuidv4()
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to like cast');
            }

            const data = await response.json()

            if (data.success) {
                setLikes(likes + 1)
            }

        } catch (error) {
            console.error('Error liking cast:', error);
            toast.error('Error liking cast');
        }
    };

    const ADD_NOTE = gql`
    mutation ADD_NOTE($input: CreateIdealiteCardv1Input!) {
        createIdealiteCardv1(input: $input) {
          document {
            id
          }
        }
      }`

    const [addNote] = useMutation(ADD_NOTE);

    const CREATE_COLLECTION = gql`
    mutation createCollection($input: CreateIdealiteProjectCardCollectionv1Input!) {
        createIdealiteProjectCardCollectionv1(input: $input) {
          document {
            id
          }
        }
      }`

    const [createCollection] = useMutation(CREATE_COLLECTION);

    const saveCast = async () => {
        let noteContent = {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            annotation: cast.text,
            cid: null,
            resourceId: process.env.NEXT_PUBLIC_PROJECT_CARD_RESOURCE_ID,
            deleted: false,
            lastReviewed: new Date().toISOString(),
            learningStatus: 'FORGETTING',
            timesForgotten: 0
        }

        try {
            const noteResult = await addNote({
                variables: {
                    input: {
                        content: noteContent
                    }
                }
            });

            if (noteResult.data.createIdealiteCardv1.document.id) {
                await createCollection({
                    variables: {
                        input: {
                            content: {
                                projectId: projectParentId,
                                idealiteCardId: noteResult.data.createIdealiteCardv1.document.id,
                                deleted: false
                            }
                        }
                    }
                });
            } else {
                throw new Error('Error creating project and card collection');
            }
        } catch (error) {
            console.error('Error saving cast:', error);
        }
    }

    const parseTextWithLinks = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">{part}</a>;
            }
            return part;
        });
    };

    return (
        <div>
            <Card className="max-w-xl mx-auto">
                <div className='flex'>
                    <CardHeader className="flex flex-col space-x-4 items-start p-0">
                        <div className="pt-4 pl-4">
                            <Avatar>
                                <AvatarImage src={author.pfp_url} alt={author.display_name} />
                                <AvatarFallback>{author.display_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        {!isLastInBranch && !isTopLevel && (
                            <div className="h-full pl-3">
                                <div className="w-[2px] bg-gray-300 mx-2 self-stretch h-full"></div>
                            </div>
                        )}
                    </CardHeader>
                    <div className="flex-col flex-grow">
                        <CardContent className="p-2">
                            <div className="flex">
                                <div className="w-full">
                                    <div className='flex justify-between'>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-semibold">{author.display_name}</p>
                                            <p className="text-sm text-gray-500">@{author.username} · {timeAgo}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="small">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal h-4 w-4"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-44">
                                                <DropdownMenuRadioGroup>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => deleteCast()} className='text-red-600 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-red-100 focus:text-red-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        <span>Delete</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => saveCast()} className='text-gray-600 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
                                                        <Save className="mr-2 h-4 w-4" />
                                                        <span>Save</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <p className="mt-2">{parseTextWithLinks(text)}</p>
                                    {filteredEmbeds.length > 0 && (
                                        <div className="mt-2">
                                            {filteredEmbeds.map((embed, index) => (
                                                <CastRenderEmbed key={index} embed={embed} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between p-2">
                            <CastSubCardReply author={author} replies={replies} timeAgo={timeAgo} text={text} hash={hash} />
                            <Button disabled={viewer_context.liked || (likes === (cast.reactions.likes_count + 1))} variant="ghost" size="sm" onClick={() => likeCast()}>
                                <Heart className={`w-4 h-4 mr-2 ${viewer_context.liked || likes > reactions.likes_count ? 'fill-red-500' : ''}`} />
                                {likes}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href)
                                        .then(() => {
                                            setIsLinkCopied(true);
                                            setTimeout(() => setIsLinkCopied(false), 1000);
                                        })
                                        .catch(err => {
                                            console.error('Failed to copy link: ', err);
                                        });
                                }}
                            >
                                {isLinkCopied ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Share className="w-4 h-4" />
                                )}
                            </Button>
                        </CardFooter>
                    </div>

                </div>
                {isLastInBranch && replies.count > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-gray-500"
                        onClick={() => onShowMoreReplies(hash)}
                    >
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Show more replies
                    </Button>
                )}
            </Card >
            {isTopLevel ? (
                <CastMainCardReply isTopLevel={isTopLevel} hash={hash} author={author} />
            ) :
                null
            }
        </div>

    );
};

export default CastCard