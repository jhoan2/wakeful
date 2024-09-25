import React, { useState, useEffect } from 'react'

const StyledLink = ({ children, ...props }) => (
    <a
        className="no-underline text-current break-words flex items-center border border-gray-300 rounded-lg p-2 gap-2"
        {...props}
    >
        {children}
    </a>
);

export default function CastOpenGraph({ embed }) {
    const [openGraphData, setOpenGraphData] = useState(null);
    const openGraphCache = new Map();
    const pendingRequests = new Map();
    const domainErrorTracker = new Map();

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchOpenGraphData = async (url, retryCount = 0) => {
        const domain = new URL(url).hostname;

        if (domainErrorTracker.get(domain)) {
            return { ogImage: '', ogTitle: '', ogDescription: '' };
        }

        if (openGraphCache.has(url)) {
            return openGraphCache.get(url);
        }

        if (pendingRequests.has(url)) {
            return pendingRequests.get(url);
        }

        const fetchPromise = async () => {
            try {
                await delay(100);
                const response = await fetch(`/api/getOpenGraphData?url=${encodeURIComponent(url)}`, { method: 'GET' });
                if (!response.ok) {
                    if (response.status === 429 && retryCount < 5) {
                        const backoff = Math.pow(2, retryCount) * 1000;
                        await delay(backoff);
                        return fetchOpenGraphData(url, retryCount + 1);
                    }
                    domainErrorTracker.set(domain, true);
                    throw new Error(`Failed to fetch Open Graph data: ${response.statusText}`);
                }
                const data = await response.json();
                const { ogImage = '', ogTitle = '', ogDescription = '' } = data.result;

                const openGraphData = { ogImage, ogTitle, ogDescription };
                openGraphCache.set(url, openGraphData);
                return openGraphData;
            } catch (error) {
                console.error("Error fetching Open Graph data", error);
                if (error.message.includes('500')) {
                    console.error("Server error occurred. Check server logs for more details.");
                }
                return { ogImage: '', ogTitle: '', ogDescription: '' };
            } finally {
                pendingRequests.delete(url);
            }
        };

        pendingRequests.set(url, fetchPromise());
        return fetchPromise();
    };
    useEffect(() => {
        if (embed && embed.url) {
            fetchOpenGraphData(embed.url).then(setOpenGraphData);
        }
    }, [embed]);
    if (!openGraphData) {
        return null;
    }

    return (
        <StyledLink href={embed.url} target="_blank" rel="noreferrer">
            {openGraphData.ogImage && <img src={openGraphData.ogImage} alt={openGraphData.ogTitle} className="w-[50px] h-[50px] object-cover rounded-md" />}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p className="m-0">{openGraphData.ogTitle || embed.url}</p>
                </div>
                <p className="m-0 text-gray-500 text-xs">{new URL(embed.url).hostname.replace('www.', '')}</p>
            </div>
        </StyledLink>
    )
}
