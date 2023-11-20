import React from 'react'
import { useCeramicContext } from '../../context';
import SideBar from '../../components/SideBar';
import BottomNavBar from '../../components/BottomNavBar';

export default function index() {
    const clients = useCeramicContext()
    const { composeClient, ceramic } = clients

    return (
        <div className='flex h-screen'>
            <SideBar />
            <button>Click here </button>
            <BottomNavBar />
        </div>
    )
}
