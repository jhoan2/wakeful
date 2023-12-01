import React, { useState } from 'react'

export default function ResourceCard() {
    const [toggleInput, setToggleInput] = useState(false)

    const deleteNote = () => {
        console.log('delete note')
    }

    const showTextArea = () => {
        console.log('show text area')
    }

    return (
        <div className="m-3 flex flex-col bg-white border shadow-sm max-w-sm rounded-xl group hover:shadow-lg transition dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div className="relative pt-[50%]  rounded-t-xl overflow-hidden">
                <img className="w-full h-full absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-t-xl"
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; //prevent looping
                        currentTarget.src = '/placeholder-img.png'
                    }}
                    alt="Image Description" />
            </div>
            <div className="p-4 md:p-5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                </p>
                <p className="mt-5 text-xs text-gray-500 dark:text-gray-500">
                    Last updated 5 mins ago
                </p>
            </div>
        </div>
    )
}
