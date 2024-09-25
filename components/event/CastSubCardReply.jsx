import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";
import { useNeynarContext } from '@neynar/react';
import Image from 'next/image'
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { v4 as uuidv4 } from 'uuid';
import CastRenderEmbed from './CastRenderEmbed';

export default function CastSubCardReply({ author, replies, timeAgo, text, hash }) {
    const { user } = useNeynarContext();
    const [inputImage, setInputImage] = useState(false)
    const [image, setImage] = useState(null);
    const [loadingReply, setLoadingReply] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [embeds, setEmbeds] = useState([]);
    const urlCache = useRef(new Map());

    const fetchData = async (url, fetchFunction) => {
        if (urlCache.current.has(url)) {
            return urlCache.current.get(url);
        }
        const data = await fetchFunction(url);
        if (data) {
            urlCache.current.set(url, data);
        }
        return data;
    };

    const fetchWarpcastData = async (url) => {
        try {
            const response = await fetch(`/api/eventCard?url=${encodeURIComponent(url)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Warpcast data');
            }

            const castData = await response.json();
            return {
                url,
                type: "warpcast",
                castData
            };
        } catch (error) {
            console.error('Error fetching Warpcast data:', error);
            return null;
        }
    };

    const fetchOpenGraphData = async (url) => {
        try {
            const response = await fetch(`/api/getOpenGraphData?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch Open Graph data');
            }
            const data = await response.json();
            return {
                url,
                type: "opengraph",
                ogData: data.result
            };
        } catch (error) {
            console.error('Error fetching Open Graph data:', error);
            return null;
        }
    };

    const pinFileToIPFS = async (file) => {
        const formData = new FormData();
        formData.set('file', file)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/cardImage`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const { pinataData } = data;
            return pinataData;
        } catch (error) {
            console.log(error.message);
        }
    }

    const handlePaste = (event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData || !clipboardData.items.length) return;

        const item = clipboardData.items[0];
        if (!item.type.startsWith('image/')) {
            const inputElement = document.getElementById('paste-image');
            if (!inputElement) return
            inputElement.value = '';
            return;
        };

        const file = item.getAsFile();
        setImage(file);
        const inputElement = document.getElementById('input-image');
        inputElement.disabled = true;
    }

    const submitReply = async () => {
        let IpfsHash;
        setLoadingReply(true);

        if (image) {
            const data = await pinFileToIPFS(image);
            IpfsHash = data?.IpfsHash;
        }

        let replyContent = {
            signer_uuid: user.signer_uuid,
            text: replyText,
            embeds: [],
            parent: hash,
            parent_author_fid: author.fid,
            idem: uuidv4()
        }

        if (IpfsHash) {
            replyContent.embeds.push({
                url: `https://purple-defensive-anglerfish-674.mypinata.cloud/ipfs/${IpfsHash}`,
                metadata: {
                    _status: 'PENDING'
                }
            });
        }

        if (embeds.length > 0) {
            embeds.map((embed) => {
                if (embed.type === 'warpcast') {
                    replyContent.embeds.push({
                        cast_id: {
                            fid: embed.castData.cast.author.fid,
                            hash: embed.castData.cast.hash
                        }
                    })
                } else {
                    replyContent.embeds.push({
                        url: embed.url
                    })
                }
            })
        }

        try {
            const response = await fetch('/api/eventCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(replyContent),
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            const data = await response.json();

            if (data.message === 'success') {
                toast.success('Reply sent!');
            }

        } catch (error) {
            console.error('Error creating event:', error);
            toast.error('Error sending reply.')
        } finally {
            setLoadingReply(false);
        }
    }

    const processUrls = useCallback(debounce(async (urls) => {
        const newEmbeds = await Promise.all(urls.map(async (url) => {
            if (url.includes('warpcast.com')) {
                return await fetchData(url, fetchWarpcastData);
            } else {
                return await fetchData(url, fetchOpenGraphData);
            }
        }));

        setEmbeds(newEmbeds.filter(embed => embed !== null));
    }, 500), []);

    useEffect(() => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = replyText.match(urlRegex) || [];

        const newUrls = urls.filter(url => !urlCache.current.has(url));

        if (newUrls.length > 0) {
            processUrls(newUrls);
        } else {
            setEmbeds(urls.map(url => urlCache.current.get(url)).filter(Boolean));
        }
    }, [replyText, processUrls]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {replies.count}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl h-3/4">
                <DialogHeader>
                    <DialogTitle>Reply to Cast</DialogTitle>
                    <DialogDescription>Type your reply below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-start space-x-2 mb-4">
                        <Avatar>
                            <AvatarImage src={author.pfp_url} alt={author.display_name} />
                            <AvatarFallback>{author.display_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{author.display_name}</p>
                            <p className="text-sm text-gray-500">@{author.username} · {timeAgo}</p>
                            <p className="mt-2">{text}</p>
                        </div>
                    </div>
                    <Textarea
                        placeholder="Type your reply here."
                        className='w-full p-2 text-sm'
                        onPaste={handlePaste}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        maxLength={320}
                    />
                    {embeds.map((embed, index) => (
                        <div key={index} className="mt-2 border rounded shadow-sm">
                            <Card>
                                <CardHeader>
                                    {embed.type === "opengraph" && embed.ogData.ogImage && embed.ogData.ogImage.length > 0 && (
                                        <img
                                            alt="OG Image"
                                            className="w-full h-[200px] object-cover rounded-t-lg"
                                            height="200"
                                            src={embed.ogData.ogImage[0].url}
                                            style={{
                                                aspectRatio: "400/200",
                                                objectFit: "cover",
                                            }}
                                            width="400"
                                        />
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {embed.type === "opengraph" ? (
                                        <>
                                            <CardTitle>{embed.ogData.ogTitle}</CardTitle>
                                            <CardDescription>{embed.ogData.ogDescription}</CardDescription>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center mb-2">
                                                <img
                                                    src={embed.castData.cast.author.pfp_url}
                                                    alt={embed.castData.cast.author.display_name}
                                                    className="w-10 h-10 rounded-full mr-3"
                                                />
                                                <div>
                                                    <p className="font-semibold">{embed.castData.cast.author.display_name}</p>
                                                    <p className="text-sm text-gray-500">@{embed.castData.cast.author.username}</p>
                                                </div>
                                            </div>
                                            <p className="mb-2">{embed.castData.cast.text}</p>
                                            {embed.castData.cast.embeds && embed.castData.cast.embeds.map((nestedEmbed, index) => (
                                                <CastRenderEmbed key={index} embed={nestedEmbed} />
                                            ))}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}

                </div>
                {image && (
                    <div className="relative w-full h-64">
                        <Image
                            fill
                            style={{ objectFit: 'contain' }}
                            src={URL.createObjectURL(image)}
                            alt="Pasted Image"
                            className="max-w-full max-h-64 p-4"
                        />
                    </div>
                )}
                <DialogFooter className='md:justify-between'>
                    <div className='flex items-center'>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                                e.preventDefault();
                                setInputImage(!inputImage)
                            }}
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                        <input
                            type='file'
                            id='input-image'
                            onChange={(event) => setImage(event.target.files[0])}
                            className={`${inputImage ? '' : 'invisible'} file:py-2 file:px-3 file:inline-flex file:items-center file:gap-x-2 file:text-sm file:font-semibold file:rounded-lg file:border file:border-transparent file:bg-blue-100 file:text-blue-800 file:hover:bg-blue-200 file:disabled:opacity-50 file:disabled:pointer-events-none file:dark:hover:bg-blue-900 file:dark:text-blue-400 file:dark:focus:outline-none file:dark:focus:ring-1 file:dark:focus:ring-gray-600`} />
                    </div>
                    <div className='flex items-center'>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-gray-500">{replyText.length}/320</span>
                            <Button
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                disabled={loadingReply}
                                onClick={() => submitReply()}
                            >
                                {loadingReply ? 'Submitting...' : 'Reply'}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
