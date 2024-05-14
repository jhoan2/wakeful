import React, { useState } from 'react'
import HomeCreateGooglePlay from './HomeCreateGooglePlay'
import HomeCreateOpenGraph from './HomeCreateOpenGraph'

export default function HomeAddResourceCreate({ url, setShowAddResourceModal }) {
    const [loadingCreateGooglePlay, setLoadingCreateGooglePlay] = useState(false)
    if (url.includes('play.google.com/books')) {
        return (
            <>
                {
                    loadingCreateGooglePlay ?
                        <p>Submitting...</p>
                        :
                        <HomeCreateGooglePlay
                            googlePlayUrl={url}
                            setShowAddResourceModal={setShowAddResourceModal}
                            setLoadingCreateGooglePlay={setLoadingCreateGooglePlay}
                        />
                }
            </>

        )
    } else {
        return (
            <HomeCreateOpenGraph url={url} setShowAddResourceModal={setShowAddResourceModal} />
        )
    }
}
