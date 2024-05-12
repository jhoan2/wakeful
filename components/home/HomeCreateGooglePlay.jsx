import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import HomeCreateGooglePlaySkeleton from './HomeCreateGooglePlaySkeleton';
import HomeCreateGooglePlayCard from './HomeCreateGooglePlayCard';

export default function HomeCreateGooglePlay({ googlePlayUrl, setShowAddResourceModal }) {
    const [bookTitle, setBookTitle] = useState('')
    const [loadingOpenBooks, setLoadingOpenBooks] = useState(false)
    const [results, setResults] = useState([])
    const [limit, setLimit] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);

    const searchOpenBooks = (event) => {
        setLoadingOpenBooks(true)
        try {
            event.preventDefault();
            setCurrentPage(1);
            const encodedTitle = encodeURIComponent(bookTitle);
            const searchUrl = `https://openlibrary.org/search.json?title=${encodedTitle}&limit=${limit}&page=${currentPage}`;

            fetch(searchUrl)
                .then(response => response.json())
                .then(data => {
                    setResults(data.docs)
                })
                .catch(error => {
                    toast.error('Something went wrong!')
                    console.log(error.message)
                });
        } catch (error) {
            toast.error('Error searching for book')
            console.log(error.message)
        }
        setLoadingOpenBooks(false)
    }

    const getNextPage = (event) => {
        setLoadingOpenBooks(true)
        try {
            event.preventDefault();
            const encodedTitle = encodeURIComponent(bookTitle);
            const searchUrl = `https://openlibrary.org/search.json?title=${encodedTitle}&limit=${limit}&page=${currentPage + 1}`;

            fetch(searchUrl)
                .then(response => response.json())
                .then(data => {
                    setResults(data.docs)
                })
                .catch(error => {
                    toast.error('Something went wrong!')
                    console.log(error.message)
                });

            setCurrentPage(currentPage + 1);
        } catch (error) {
            toast.error('Could not find next page')
            console.log(error.message)
        }
        setLoadingOpenBooks(false)
    };

    return (
        <div className='pt-4'>
            <Label htmlFor="title">Title</Label>
            <div className='flex'>
                <Button type="submit" variant='secondary' onClick={(e) => searchOpenBooks(e)} > <Search /></Button>
                <Input
                    placeholder='Type title of book here.'
                    id='title'
                    onChange={(e) => setBookTitle(e.target.value)}
                    type='text'
                    name='Book Title'
                    autoComplete='off'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            searchOpenBooks(e)
                        }
                    }}
                />
            </div>
            <div>
                {loadingOpenBooks ? <HomeCreateGooglePlaySkeleton /> : null}
                {results && results.length > 0 ?
                    <div className='space-y-4 p-6 max-w-md mx-auto'>
                        <p>Select your book:</p>
                        {results.map((book) => {
                            return <HomeCreateGooglePlayCard
                                key={book.key}
                                title={book.title ? book.title : ''}
                                author={book?.author_name ? book?.author_name[0] : ''}
                                firstSentence={book?.first_sentence ? book?.first_sentence[0] : ''}
                                published={book?.first_publish_year ? book.first_publish_year : 0}
                                coverUrl={`https://covers.openlibrary.org/b/id/${book?.cover_i}-S.jpg`}
                                googlePlayUrl={googlePlayUrl}
                                setShowAddResourceModal={setShowAddResourceModal}
                            />
                        })}
                    </div>
                    :
                    <p className='flex justify-center text-lg'>No results yet.</p>
                }
            </div>
            <div className='flex justify-end pr-4 pb-4'>
                {
                    results && results.length > 0 ?
                        <button
                            className='h-9 rounded-md px-3 inline-flex items-center content-end whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80'
                            onClick={(e) => {
                                getNextPage(e);
                            }}>
                            Next
                        </button> :
                        null
                }
            </div>
        </div >
    )
}
