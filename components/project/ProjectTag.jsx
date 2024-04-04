import React from 'react'

export default function ProjectTag({ tags }) {
    return (
        <div>
            {tags.map((tag) => {
                return <p>{tag.name}</p>
            })}
        </div >
    )
}
