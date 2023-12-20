import React from 'react'

export default function NoContent({ src }) {
    return (
        <div className='flex-grow flex justify-center items-center'>
            <div className='flex flex-col items-center'>
                <div className='rounded-full bg-gray-200 p-10 inline-flex justify-center items-center'>
                    <img src={src} className="w-40 h-40 object-cover rounded-full" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-gray-800">No content yet</p>
            </div>
        </div>
    )
}
