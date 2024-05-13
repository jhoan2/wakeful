import React from 'react'
import HomeCreateGooglePlay from './HomeCreateGooglePlay'
import HomeCreateOpenGraph from './HomeCreateOpenGraph'

export default function HomeAddResourceCreate({ url, setShowAddResourceModal }) {
    if (url.includes('play.google.com/books')) {
        return (
            <HomeCreateGooglePlay googlePlayUrl={url} setShowAddResourceModal={setShowAddResourceModal} />
        )
    } else {
        return (
            <HomeCreateOpenGraph url={url} setShowAddResourceModal={setShowAddResourceModal} />
        )
    }
}
