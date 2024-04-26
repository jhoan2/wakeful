import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BottomNavBar({ page, setPage, setShowModal, avatarFallback }) {

    return (
        <div className="fixed inset-x-0 bottom-0 bg-white shadow md:hidden ">
            <nav className="flex justify-between max-w-md mx-auto p-4 bg-slate-100">
                <Link href={'/home'} className="flex flex-col items-center" onClick={() => setPage('home')}>
                    <button title='Home' className={`hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'home' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001V11.0001L1 11.0001L11.3273 1.61162C11.7087 1.26488 12.2913 1.26488 12.6727 1.61162L23 11.0001L20 11.0001V20.0001C20 20.5524 19.5523 21.0001 19 21.0001ZM6 19.0001H18V9.15757L12 3.70302L6 9.15757V19.0001Z"></path></svg>
                    </button>
                    <span className="text-xs">Home</span>
                </Link>
                <Link href={'/projects'} className="flex flex-col items-center" onClick={() => setPage('projects')}>
                    <button title='Projects' className={`w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'projects' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM8 19H20V11H8V19ZM6 19V10C6 9.44772 6.44772 9 7 9H20V7H11.5858L9.58579 5H4V19H6Z"></path></svg>
                    </button>
                    <span className="text-xs">Projects</span>
                </Link>
                {(page === 'resource') ?
                    <div className="flex flex-col items-center">
                        <button title='Open Add Note' onClick={() => setShowModal(true)} className={`w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'projects' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-10 h-10'><path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path></svg>
                        </button>
                    </div>
                    :
                    null
                }
                <Link href={'/profile'} className="flex flex-col items-center" onClick={() => setPage('profile')} >
                    <Avatar title='Profile'>
                        <AvatarImage />
                        <AvatarFallback className={`w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center text-sm font-semibold rounded-full border border-transparent text-gray-500 truncate disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'profile' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">Profile</span>
                </Link>
                <Link href={'/'} className="flex flex-col items-center">
                    <button title='Projects' className={`w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}>
                        <Image src='/icon48.png' alt='idealite logo' width={64} height={64} priority />
                    </button>
                    <span className="text-xs">Idealite</span>
                </Link>
            </nav>
        </div>
    )
}
