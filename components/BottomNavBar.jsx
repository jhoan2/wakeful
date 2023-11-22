import React from 'react'
import Link from 'next/link'
export default function BottomNavBar({ page }) {
    return (
        <div className="fixed inset-x-0 bottom-0 bg-white shadow md:hidden ">
            <nav className="flex justify-between max-w-md mx-auto p-4 bg-slate-100">
                <Link href={'/home'} className="flex flex-col items-center">
                    <button title='Home' className={`hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'home' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001V11.0001L1 11.0001L11.3273 1.61162C11.7087 1.26488 12.2913 1.26488 12.6727 1.61162L23 11.0001L20 11.0001V20.0001C20 20.5524 19.5523 21.0001 19 21.0001ZM6 19.0001H18V9.15757L12 3.70302L6 9.15757V19.0001Z"></path></svg>
                    </button>
                    <span className="text-xs">Home</span>
                </Link>
                <Link href={'/projects'} className="flex flex-col items-center">
                    <button title='Projects' className={`hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${page === 'projects' ? 'bg-gray-400' : 'bg-slate-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M12.4142 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5ZM8 19H20V11H8V19ZM6 19V10C6 9.44772 6.44772 9 7 9H20V7H11.5858L9.58579 5H4V19H6Z"></path></svg>
                    </button>
                    <span className="text-xs">Projects</span>
                </Link>
                <a href="#" className="flex flex-col items-center">
                    <svg className="h-6 w-6" /* Add your SVG icon here */></svg>
                    <span className="text-xs">Notifications</span>
                </a>
                <Link href={'/'} className="flex flex-col items-center">
                    <button title='Projects' className={`hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}>
                        <img src={'/idealite-day-double.svg'} />
                    </button>
                    <span className="text-xs">Front Page</span>
                </Link>
            </nav>
        </div>
    )
}
