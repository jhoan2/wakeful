import React, { useState, useEffect, use } from 'react';
import Sidebar from './SideBar';
import BottomNavBar from './BottomNavBar';
import { authenticateCeramic } from '../utils';
import { useCeramicContext } from '../context';

export default function Layout({ children }) {
    const [page, setPage] = useState('home')
    const clients = useCeramicContext();
    const { ceramic, composeClient } = clients;
    const composeClientId = composeClient.id
    const avatarFallback = composeClientId ? composeClientId.substring(composeClientId.length - 5) : ''


    const handleLogin = () => {
        authenticateCeramic(ceramic, composeClient)
    }

    useEffect(() => {
        if (localStorage.getItem('ceramic:eth_did')) {
            handleLogin()
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
