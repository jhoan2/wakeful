import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fde68a_40%,#facc15_100%)]">
        <div className="h-full px-6 pt-6 lg:px-8">
          <div className='h-full'>
            <nav className="flex h-9 items-center justify-between m-3" aria-label="Global">
              <div className="flex lg:min-w-0 lg:flex-1 rounded-full bg-gray-100 p-2 space-x-2" aria-label="Global">
                <Image src='/icon128.png' width={32} height={32} alt='idealite logo' />
                <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">Idealite</h2>
              </div>
            </nav>
            <main className='h-full'>
              <div className="flex flex-col items-center justify-center min-h-screen px-6 lg:px-8 space-y-8">
                <div className='flex flex-col items-center space-y-8'>
                  <p className='text-5xl md:text-8xl text-left md:text-center text-balance'>Massive Multiplayer Online Learning Game</p>
                  <p className='text-xl md:text-3xl text-gray-400'>Idealite makes learning online fun, co-op, and .</p>
                </div>
                <div className='flex flex-row space-x-2 items-center'>
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