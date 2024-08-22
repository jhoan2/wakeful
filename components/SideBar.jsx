import React, { useState } from 'react';
import Link from 'next/link';
import { useCeramicContext } from '../context';
import Image from 'next/image';
import { Ghost, Tags, Home, Folder, Compass } from 'lucide-react';
import TagTree from './tags/TagTree';
import HomeGetProfile from './home/HomeGetProfile';
import { UserRound } from 'lucide-react';


export default function SideBar({ page, setPage, avatarFallback }) {
    const clients = useCeramicContext();
    const { composeClient } = clients
    const [showTags, setShowTags] = useState(false)

    return (
        <div id="sidebar-mini" className="flex flex-col translate-x-0 -translate-x-full p-2 h-full xl:w-[300px] transition-all duration-300 transform hidden z-[1] bg-slate-100 border-e border-gray-200 md:block md:translate-x-0 md:end-auto md:bottom-0  dark:bg-gray-800 dark:border-gray-700">
            <HomeGetProfile />
            {showTags ?
                <TagTree setShowTags={setShowTags} />
                :
                <div className="flex flex-col justify-center items-center gap-y-2 py-4">
                    <Link href={'/'}>
                        <div className="flex items-center text-lg space-x-2 mb-4">
                            <Image src='/icon48.png' alt='idealite logo' width={64} height={64} priority />
                            <p className='lg:block hidden text-3xl text-amber-400'>Idealite</p>
                        </div>
                    </Link>
                    <div className="inline-block [--placement:right]">
                        <Link href={'/home'} onClick={() => setPage('home')}>
                            <button title='Home' className={`w-16 lg:w-36 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'home' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                                <div className='flex items-center text-lg space-x-2'>
                                    <Home />
                                    <p className='lg:block hidden'>Home</p>
                                </div>
                            </button>
                        </Link>
                    </div>

                    <div className="inline-block [--placement:right]">
                        <Link href={'/projects'} onClick={() => setPage('projects')}>
                            <button title='Projects' className={`w-16 lg:w-36 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'projects' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                                <div className='flex items-center text-lg space-x-2'>
                                    <Folder />
                                    <p className='lg:block hidden'>Projects</p>
                                </div>
                            </button>
                        </Link>
                    </div>
                    <div className="inline-block [--placement:right]">
                        <Link href={'/profile'} onClick={() => setPage('profile')}>
                            <button title='Explore' className={`w-16 lg:w-36 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'profile' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                                <div className='flex items-center space-x-2 text-lg'>
                                    <UserRound />
                                    <p className='lg:block hidden'>Profile</p>
                                </div>
                            </button>
                        </Link>
                    </div>
                    <div className="inline-block [--placement:right]">
                        <button type="button" title='Show Tags' onClick={() => setShowTags(true)} className=" w-16 lg:w-36 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                            <div className='flex items-center text-lg space-x-2'>
                                <Tags />
                                <p className='lg:block hidden'>Show Tags</p>
                            </div>
                        </button>
                    </div>
                    <div className="inline-block [--placement:right]">
                        <Link href={'/tags'} onClick={() => setPage('explore')}>
                            <button title='Explore' className={`w-16 lg:w-36 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'explore' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                                <div className='flex items-center text-lg space-x-2'>
                                    <Compass />
                                    <p className='lg:block hidden'>Explore</p>
                                </div>
                            </button>
                        </Link>
                    </div>
                    {composeClient.id && composeClient.id.includes('0x399848148c887fc42b91ac0918a2d8050a211201') ?
                        <div className="inline-block">
                            <Link href={'/admin'} onClick={() => setPage('admin')}>
                                <button title='Projects' className={`w-16 lg:w-36 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'admin' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                                    <div className='flex items-center text-lg space-x-2'>
                                        <Ghost />
                                        <p className='lg:block hidden'>Admin</p>
                                    </div>
                                </button>
                            </Link>
                        </div>
                        :
                        null
                    }
                    <div className='pt-2'>
                        <w3m-button balance='hide' />
                    </div>
                </div>
            }
        </div>
    )
}
