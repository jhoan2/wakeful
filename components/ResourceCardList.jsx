import React from 'react'
import ResourceCard from './ResourceCard'

export default function ResourceCardList() {
    return (
        <div className='flex flex-wrap sm:justify-center pb-24 justify-start md:pb-0 mx-auto p-4 '>
            <ResourceCard />
            <ResourceCard />
            <ResourceCard />
            <ResourceCard />
            <ResourceCard />
        </div>
    )
}
