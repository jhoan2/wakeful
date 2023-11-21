import React from 'react'
import ResourceCard from './ResourceCard'
export default function ResourceCardList({ resources }) {
    return (
        <div className='flex-grow flex-row  overflow-auto sm:justify-center'>
            <div className='flex flex-wrap sm:justify-center pb-24 justify-start md:pb-0 mx-auto p-4 '>
                {resources.map((resource) => { return <ResourceCard key={resource.node.resource.id} resource={resource} /> })}
            </div>
        </div>
    )
}
