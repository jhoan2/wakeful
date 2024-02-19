import React from 'react'
import { useRouter } from 'next/router';

export default function ErrorPage({ message }) {
    const router = useRouter();

    return (
        <div className='flex h-screen'>
            <div className='flex-grow flex justify-center items-center'>
                <div className='flex flex-col items-center'>
                    <div className='rounded-full bg-gray-200 p-10 inline-flex justify-center items-center'>
                        <img src={'/error-blue-cat.png'} className="w-40 h-40 object-cover rounded-full" />
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-gray-800">{message}</p>
                    <button onClick={() => router.push('/home')} className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-orange-400 text-gray hover:bg-gradient-to-r from-amber-200 to-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Refresh</button>
                </div>
            </div>
        </div>
    )
}
