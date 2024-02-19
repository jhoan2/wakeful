import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GoogleTagManager } from '@next/third-parties/google'

const FrontPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('logged_in') === 'true') {
      router.push('/home')
    }

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

  }, [])

  return (
    <>
      <Head>
        <title>Idealite</title>
        <link rel="icon" href="/icon16.png" sizes="any" type="image/png" />
      </Head>
      <GoogleTagManager gtmId="G-DTEXJ081WW" />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white overflow-hidden [background:radial-gradient(125%_125%_at_50%_10%,#fde68a_40%,#facc15_100%)]">
        <div className="px-6 pt-6 lg:px-8">
          <div>
            <nav className="flex h-9 items-center justify-between" aria-label="Global">
              <div className="flex lg:min-w-0 lg:flex-1 rounded-full bg-gray-100 p-2 space-x-2" aria-label="Global">
                <Image src='/icon128.png' width={32} height={32} alt='idealite logo' />
                <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">Idealite</h2>
              </div>
            </nav>
            <main>
              <div className="flex flex-col items-center justify-center min-h-screen px-6 lg:px-8 space-y-8">
                <div className='flex flex-col items-center space-y-8'>
                  <p className='text-5xl md:text-8xl text-left md:text-center'>Learn better, together.</p>
                  <p className='text-xl md:text-3xl text-gray-400'>Idealite is a shared note-taking app.</p>
                </div>
                <div className='flex flex-row space-x-2 items-center'>
                  <button className="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
                      <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
                    </svg>
                    <span className="ml-4 flex items-start flex-col leading-none">
                      <span className="text-xs text-gray-600 mb-1">GET IT ON</span>
                      <span className="title-font font-medium">Chrome Web Store</span>
                    </span>
                  </button>
                  <button onClick={() => router.push('/home')} className="py-4 px-5 text-xl inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-orange-400 text-gray hover:bg-gradient-to-r from-amber-200 to-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Enter the app</button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default FrontPage