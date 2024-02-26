import React, { useState, useEffect, } from 'react';
import Sidebar from './SideBar';
import BottomNavBar from './BottomNavBar';
import { authenticateCeramic } from '../utils';
import { useCeramicContext } from '../context';
import { useRouter } from 'next/router';
import posthog from 'posthog-js'

export default function Layout({ children }) {
    const [page, setPage] = useState('home')
    const clients = useCeramicContext();
    const { ceramic, composeClient } = clients;
    const composeClientId = composeClient.id
    const avatarFallback = composeClientId ? composeClientId.substring(composeClientId.length - 5) : ''
    const router = useRouter()

    const handleLogin = () => {
        authenticateCeramic(ceramic, composeClient)
    }

    useEffect(() => {
        if (localStorage.getItem('ceramic:eth_did')) {
            handleLogin()
        }

        // Track page views
        const handleRouteChange = () => posthog?.capture('$pageview')
        router.events.on('routeChangeComplete', handleRouteChange)

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [])


    return (
        <div className='flex'>
            <div>
                <Sidebar page={page} setPage={setPage} avatarFallback={avatarFallback} />
            </div>
            <main className='flex justify-center w-full'>
                {children}
            </main>
            <BottomNavBar page={page} setPage={setPage} avatarFallback={avatarFallback} />
        </div>
    )
}
