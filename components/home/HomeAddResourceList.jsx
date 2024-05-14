import React from 'react'
import HomeAddResourceCard from './HomeAddResourceCard';
import HomeAddResourceCreate from './HomeAddResourceCreate';

export default function HomeAddResourceList({
    url,
    setShowAddResourceModal,
    existingAccountResource,
    existingResource
}) {

    return (
        <div>
            {/* If existingAccountResource or existingResource do not have data in them, show create component. */}
            {
                (existingResource?.length > 0 || existingAccountResource?.length > 0) ?
                    <HomeAddResourceCard />
                    :
                    <HomeAddResourceCreate url={url} setShowAddResourceModal={setShowAddResourceModal} />
            }
        </div>
    )
}
