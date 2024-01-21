import React, { useState } from 'react';
import Sidebar from './SideBar';
import BottomNavBar from './BottomNavBar';
import { useRouter } from 'next/router';


export default function Layout({ children }) {
    const [page, setPage] = useState('home')
    const router = useRouter();

    return (
        <div className='flex'>
            {/* {router.pathname === '/' ? null : <Sidebar page={page} setPage={setPage} />}
            <main className='w-full'>
                {children}
            </main>
            {router.pathname === '/' ? null : <BottomNavBar page={page} setPage={setPage} />} */}
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
