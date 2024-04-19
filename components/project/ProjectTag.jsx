import React from 'react'

export default function ProjectTag({ tags }) {
    return (
        <div>
            {tags && tags.map((tag) => (
                <p key={tag.tagId}>{tag.name}</p>
            ))}
        </div >
    )
}
