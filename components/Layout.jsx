import React, { useState } from 'react';
import Sidebar from './SideBar';
import BottomNavBar from './BottomNavBar';

export default function Layout({ children }) {
    const [page, setPage] = useState('home')

    return (
        <>
            <Sidebar page={page} setPage={setPage} />
            <main className='w-full'>
                {children}
            </main>
            <BottomNavBar page={page} setPage={setPage} />
        </>
    )
}
