import React from 'react';
import EventTagPanel from './EventTagPanel';

export default function EditTagGroup({ tags }) {
    if (!tags) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <EventTagPanel
                    key={tag.node.idealiteTag.id}
                    eventTagId={tag.node.id}
                    name={tag.node.idealiteTag.name}
                />
            ))}
        </div>
    )
}
