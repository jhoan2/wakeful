import React from 'react';
import ProjectTag from './ProjectTag';

export default function ProjectTagGroup({ tags, category }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags && tags.map((tag) => (
                <ProjectTag
                    key={tag.node.idealiteTag.id}
                    projectTitleTagId={tag.node.id}
                    projectTagId={tag.node.id}
                    name={tag.node.idealiteTag.name}
                    category={category}
                />
            ))}
        </div>
    )
}