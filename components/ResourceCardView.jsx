import React, { useState } from 'react'
import ResourceCard from './ResourceCard'
import ResourceAddNote from './ResourceAddNote'

export default function ResourceCardView({ cards, resourceUrl, resourceId, setShowModal, showModal }) {
    return (
        <div className='flex flex-wrap sm:justify-center pb-24 justify-start md:pb-0 mx-auto p-4 '>
            {cards.map((card) => {
                return <ResourceCard key={card.node.id} card={card} />
            })}
            <button className='fixed top-12 md:right-12 lg:right-4 hidden md:block py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600' onClick={() => setShowModal(true)}>Add Note</button>
            {showModal ?
                <ResourceAddNote setShowModal={setShowModal} resourceId={resourceId} resourceUrl={resourceUrl} />
                : null
            }
        </div>
    )
}
