import React, { useState, useEffect } from 'react';
import Sidebar from './SideBar';
import BottomNavBar from './BottomNavBar';
import { authenticateCeramic } from '../utils';
import { useCeramicContext } from '../context';

export default function Layout({ children }) {
    const [page, setPage] = useState('home')
    const clients = useCeramicContext();
    const { ceramic, composeClient } = clients;

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
                <Sidebar page={page} setPage={setPage} />
            </div>
            <main className='flex justify-center w-full'>
                {children}
            </main>
            <BottomNavBar page={page} setPage={setPage} />
        </div>
    )
}
