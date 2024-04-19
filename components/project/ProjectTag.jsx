import React from 'react'

export default function ProjectTag({ tags }) {
    return (
        <div>
            {tags.map((tag) => {
                return <p key={tag.tagId}>{tag.name}</p>
            })}
        </div >
    )
}
