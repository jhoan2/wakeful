import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { gql, useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import HomeAddResourceList from './HomeAddResourceList';
import HomeAddResourceCreate from './HomeAddResourceCreate';

export default function HomeAddResource({ setShowAddResourceModal }) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [exists, setExists] = useState(null);

    const QUERY_RESOURCE = gql`
    query queryResource ($url: String!) {
        idealiteResourceIndex(filters: {where: {url: {equalTo: $url}}}, first: 10) {
          edges {
            node {
              description
              id
              title
              author
            }
          }
        }
      }
`

    const [sendQueryResource, { error: errorQueryResource }] = useLazyQuery(QUERY_RESOURCE, {
        variables: { url: url },
    });

    const handleClickOutside = (event) => {
        if (event.target !== document.getElementById('modal-content') && event.target.contains(document.getElementById('modal-content'))) {
            setShowAddResourceModal(false)
            setUrl(null)
        }
    };

    useEffect(() => {
        let timeoutId;

        const handleSearch = async () => {
            setIsLoading(true);
            const response = await sendQueryResource(url);
            let resources = response.data?.idealiteResourceIndex?.edges
            setExists(resources);
            setIsLoading(false);
        };

        const debouncedSearch = () => {
            clearTimeout(timeoutId);
            if (url) {
                if (url.includes('www.youtube.com') || url.includes('play.google.com/books')) {
                    const getBaseUrl = (url) => {
                        const hashIndex = url.indexOf('&');
                        if (hashIndex > -1) {
                            return url.substring(0, hashIndex)
                        } else {
                            return url
                        }
                    }
                    const baseUrl = getBaseUrl(url)
                    setUrl(baseUrl)
                } else {
                    try {
                        const urlObject = new URL(url)
                        const cleanedUrl = urlObject.origin + urlObject.pathname
                        setUrl(cleanedUrl)
                    } catch (error) {
                        toast.error(error.message)
                        console.log(error.message)
                    }
                }
                timeoutId = setTimeout(handleSearch, 500);
            } else {
                setExists(null);
            }
        };

        debouncedSearch();

        return () => clearTimeout(timeoutId);
    }, [url]);

    if (errorQueryResource) {
        toast.error('Something went wrong with searching for the resource')
        console.log(errorQueryResource.message)
    }

    return (
        <div className='fixed z-10 top-0 left-0 w-full h-full overflow-auto bg-gray-700 bg-opacity-75' onClick={(e) => handleClickOutside(e)}>
            <div className='flex place-content-center mt-60 '>
                <div id='modal-content' className="m-3 flex flex-col bg-white border w-full md:w-1/2 md:h-2/3  shadow-sm rounded-xl group hover:shadow-lg transition p-6 dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                    <div className='flex justify-end mb-3'>
                        <button className='hover:bg-gray-300 rounded-xl' title='Close Modal' onClick={() => setShowAddResourceModal(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-4 h-4'><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path></svg>
                        </button>
                    </div>
                    <Label htmlFor="url">URL</Label>
                    <Input placeholder='Paste in url here.' id='url' onChange={(e) => setUrl(e.target.value)} type='text' name='Paste Url' autoComplete='off' />
                    {isLoading ? <p>Searching for resource...</p> : null}
                    {(exists?.length > 0) ? <HomeAddResourceList data={exists} url={url} /> : <HomeAddResourceCreate url={url} setShowAddResourceModal={setShowAddResourceModal} />}
                </div>
            </div>
        </div>
    )
}
