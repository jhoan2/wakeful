import React from 'react'
import HomeAddResourceCard from './HomeAddResourceCard'
import HomeAddResourceAccountCard from './HomeAddResourceAccountCard'

export default function HomeAddResourceList({ setShowAddResourceModal, existingResource, existingAccountResource }) {
    return (
        <div className='grid grid-cols-4 pt-4'>
            {existingAccountResource?.length > 0 ?
                existingAccountResource.map((node) => {
                    return (
                        <HomeAddResourceAccountCard
                            key={node.node.id}
                            title={node.node.resource?.title}
                            updatedAt={node.node?.updatedAt}
                            createdAt={node.node?.createdAt}
                            resourceId={node.node?.resourceId}
                            cid={node.node.resource?.cid}
                        />
                    )
                })
                :
                null
            }
            {existingResource?.length > 0 ?
                existingResource.map((node) => {
                    return (
                        <HomeAddResourceCard
                            key={node.node.id}
                            setShowAddResourceModal={setShowAddResourceModal}
                            title={node.node.title}
                            cid={node.node.cid}
                            description={node.node.description}
                            url={node.node.url}
                            resourceId={node.node.id}
                        />
                    )
                })
                :
                null
            }

        </div>
    )
}
