import React from 'react'
import { useCeramicContext } from '../../context';
import SideBar from '../../components/SideBar';
import BottomNavBar from '../../components/BottomNavBar';
import SkeletonHomeCard from '../../components/SkeletonHomeCard';
import NoContent from '../../components/NoContent';
export default function index() {
    const clients = useCeramicContext()
    const { composeClient, ceramic } = clients
    const data = true
    const loading = false
    return (
        <div className='flex h-screen'>
            <SideBar page={'projects'} />
            {loading ?
                (<div className='md:flex'>
                    <SkeletonHomeCard />
                    <SkeletonHomeCard />
                    <SkeletonHomeCard />
                </div>)
                :
                (
                    data ?
                        <div>Projects</div>
                        :
                        <NoContent src='/no-content-cat.png' />
                )
            }
            <BottomNavBar page={'projects'} />
        </div>
    )
}
