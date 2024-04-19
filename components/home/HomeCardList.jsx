import React from 'react'
import HomeCard from '../home/HomeCard'

export default function HomeCardList({ resources }) {
    return (
        <div className='flex flex-wrap sm:justify-center justify-start md:pb-0 mx-auto p-4 '>
            {resources.map((resource) => (
                <HomeCard
                    key={resource.node.resource.id}
                    resource={resource}
                />
            ))}
        </div>
    )
}
