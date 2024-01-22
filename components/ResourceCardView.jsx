import React from 'react'
import ResourceCard from './ResourceCard'
import ResourceAddNote from './ResourceAddNote'
import { Button } from "@/components/ui/button";

export default function ResourceCardView({ cards, resourceUrl, resourceId, setShowModal, showModal, resourceTitle }) {
    return (
        <div className='flex-grow  overflow-auto sm:justify-center flex-wrap'>
            <p className='text-3xl font-bold p-8'>{resourceTitle}</p>
            <div className='grid grid-cols-3'>
                <div></div>
                <div className='flex justify-end'>
                    <Button
                        variant='secondary'
                        onClick={() => setShowProjectModal(true)}
                    >
                        Add Note
                    </Button>
                    {showModal ?
                        <ResourceAddNote setShowModal={setShowModal} resourceId={resourceId} resourceUrl={resourceUrl} />
                        :
                        null
                    }
                </div>
                <div></div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3'>
                {cards.map((card) => {
                    return <ResourceCard card={card} key={card.node.id} />
                })}
            </div>
        </div>
    )
}
