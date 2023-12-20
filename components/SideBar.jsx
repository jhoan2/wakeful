import React from 'react'
import Link from 'next/link'
import AuthPrompt from './did-select-popup'
import { useCeramicContext } from '../context'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function SideBar({ page }) {
    const clients = useCeramicContext();
    const { ceramic, composeClient } = clients
    const router = useRouter()
    const handleLogout = () => {
        localStorage.setItem("logged_in", "false")
        localStorage.removeItem('ceramic:did_seed')
        localStorage.removeItem('ceramic:eth_did')
        localStorage.removeItem('did')
        localStorage.removeItem('ceramic:auth_type')
        window.location.reload()
    }

    return (
        <div id="sidebar-mini" className="flex flex-col hs-overlay hs-overlay-open:translate-x-0 -translate-x-full h-full transition-all duration-300 transform hidden z-[1] bg-slate-100 border-e border-gray-200 md:block md:translate-x-0 md:end-auto md:bottom-0  dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col justify-center items-center gap-y-2 py-4">
                <Link href={'/'}>
                    <div className="mb-4">
                        <Image src='/icon48.png' alt='idealite logo' width={64} height={64} />
                    </div>
                </Link>
                <div className="hs-tooltip inline-block [--placement:right]">
                    <Link href={'/home'}>
                        <button title='Home' className={`hs-tooltip-toggle w-16 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'home' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-10 h-10'><path d="M19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001V11.0001L1 11.0001L11.3273 1.61162C11.7087 1.26488 12.2913 1.26488 12.6727 1.61162L23 11.0001L20 11.0001V20.0001C20 20.5524 19.5523 21.0001 19 21.0001ZM6 19.0001H18V9.15757L12 3.70302L6 9.15757V19.0001Z"></path></svg>
                        </button>
                    </Link>
                </div>

                {/* <div className="hs-tooltip inline-block [--placement:right]">
                    <Link href={'/projects'}>
                        <button title='Projects' className={`hs-tooltip-toggle  w-16 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'projects' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-10 h-10'><path d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM8 19H20V11H8V19ZM6 19V10C6 9.44772 6.44772 9 7 9H20V7H11.5858L9.58579 5H4V19H6Z"></path></svg>
                        </button>
                    </Link>
                </div> */}

                <div className="hs-tooltip inline-block [--placement:right]">
                    {ceramic.did ?
                        <button type="button" title='Logout' onClick={() => handleLogout()} className="hs-tooltip-toggle  w-16 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-10 h-10'><path d="M4 18H6V20H18V4H6V6H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V18ZM6 11H13V13H6V16L1 12L6 8V11Z"></path></svg>
                        </button>
                        :
                        <AuthPrompt />
                    }
                </div>
            </div>
        </div>
    )
}
