import React from 'react';
import ProjectTag from './ProjectTag';

export default function ProjectTagGroup({ tags }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags && tags.map((tag) => (
                <ProjectTag key={tag.node.idealiteTag.id} tagId={tag.node.idealiteTag.id} name={tag.node.idealiteTag.name} />
            ))}
        </div>
    )
}