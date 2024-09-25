import React from 'react'
import HomeAddResourceCard from './HomeAddResourceCard';
import HomeAddResourceCreate from './HomeAddResourceCreate';
import HomeAddResourceList from './HomeAddResourceList';

export default function HomeAddResourceExist({
    url,
    setShowAddResourceModal,
    existingAccountResource,
    existingResource
}) {

    return (
        <div id='modal-content-HomeAddResourceExist'>
            {/* If existingAccountResource or existingResource do not have data in them, show create component. */}
            {
                (existingResource?.length > 0 || existingAccountResource?.length > 0) ?
                    <HomeAddResourceList
                        setShowAddResourceModal={setShowAddResourceModal}
                        existingAccountResource={existingAccountResource}
                        existingResource={existingResource}
                    />
                    :
                    <HomeAddResourceCreate url={url} setShowAddResourceModal={setShowAddResourceModal} />
            }
        </div>
    )
}
