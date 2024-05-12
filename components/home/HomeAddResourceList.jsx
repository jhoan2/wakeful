import React from 'react'

export default function HomeAddResourceList({ data, url }) {
    return (
        <div>
            <a href="https://www.youtube.com/watch?v=VJIoSN8Hmh0&ab_channel=Blazed" target="_blank" title="Video Title">
                Link Text or YouTube video title
            </a>
            <a href="https://www.youtube.com/watch?v=" target="_blank" title="Video Title">
                Link Text or YouTube video title
            </a>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/VJIoSN8Hmh0" allowfullscreen></iframe>
            <p>Something</p>
        </div>
    )
}
