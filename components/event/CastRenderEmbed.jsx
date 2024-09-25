import React, { useState, useEffect } from 'react'
import Hls from 'hls.js';
import CastOpenGraph from './CastOpenGraph';
import CastCard from './CastCard';

export default function CastRenderEmbed({ embed }) {
    const [castData, setCastData] = useState(null);

    const fetchCastData = async (hash) => {
        try {
            const response = await fetch(`/api/eventCard?hash=${hash}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cast data');
            }

            const data = await response.json();
            setCastData(data.cast);
        } catch (error) {
            console.error('Error fetching cast data:', error);
        }
    };

    const ImageWrapper = ({ src, alt, className }) => (
        <img
            src={src}
            alt={alt}
            className={`block h-auto max-h-[150px] w-auto max-w-full object-cover border border-gray-300 rounded-lg my-2.5 ${className}`}
        />
    );

    const NativeVideoPlayer = ({ url }) => {
        const videoRef = React.useRef(null);

        React.useEffect(() => {
            if (videoRef.current) {
                if (Hls.isSupported() && url.endsWith('.m3u8')) {
                    const hls = new Hls();
                    hls.loadSource(url);
                    hls.attachMedia(videoRef.current);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        videoRef.current.play();
                    });
                } else {
                    videoRef.current.src = url;
                    videoRef.current.addEventListener('loadedmetadata', () => {
                        videoRef.current.play();
                    });
                }
            }
        }, [url]);

        return (
            <video
                ref={videoRef}
                controls
                muted={true}
                className="w-auto max-w-full max-h-[400px] rounded-lg my-2.5 object-contain"
            />
        );
    };

    const isImageUrl = (url) => {
        return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(url) || url.startsWith('https://imagedelivery.net');
    };

    useEffect(() => {
        if (embed.cast_id) {
            fetchCastData(embed.cast_id.hash);
        }
    }, [embed]);

    const renderEmbed = () => {
        if (embed.cast_id && castData) {
            return (
                <div className="border border-gray-300 rounded-lg p-4 my-2.5">
                    <div className="flex items-center mb-2">
                        <img
                            src={castData.author.pfp_url}
                            alt={castData.author.display_name}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <p className="font-semibold">{castData.author.display_name}</p>
                            <p className="text-sm text-gray-500">@{castData.author.username}</p>
                        </div>
                    </div>
                    <p className="mb-2">{castData.text}</p>
                    {castData.embeds && castData.embeds.length > 0 && (
                        <div className="mt-2">
                            {castData.embeds.map((embed, index) => (
                                <CastRenderEmbed key={index} embed={embed} />
                            ))}
                        </div>
                    )}
                </div>
            );
        } else if (embed.url) {
            const url = embed.url;
            if (isImageUrl(url)) {
                return <ImageWrapper key={url} src={url} alt="Embedded image" />;
            } else if (url.endsWith('.m3u8') || url.endsWith('.mp4')) {
                return <NativeVideoPlayer key={url} url={url} />;
            } else {
                return <CastOpenGraph embed={embed} />;
            }
        }
    };

    return (
        <div>
            {renderEmbed()}
        </div>
    );
}
