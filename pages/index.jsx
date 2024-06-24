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
      <div className="-z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fde68a_40%,#facc15_100%)]">
        <div className="h-full px-6 pt-6 lg:px-8">
          <div className='h-full'>
            <nav className="flex h-9 items-center justify-between m-3 rounded-full bg-gray-100 p-9 space-x-2" aria-label="Global">
              <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                <Image src='/icon128.png' width={32} height={32} alt='idealite logo' />
                <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">Idealite</h2>
              </div>
              <div className='w-1/4 flex items-center justify-center space-x-4'>
                <p className='text-xl hover:text-amber-400 hover:cursor-pointer' onClick={() => router.push('/about')}>About</p>
                <p className='text-xl hover:text-amber-400 hover:cursor-pointer'>
                  <Link href="https://warpcast.com/~/channel/idealite" target="_blank">Community</Link>
                </p>
              </div>
            </nav>
            <main className='h-full'>
              <div className="flex flex-col items-center justify-center min-h-screen px-6 lg:px-8 space-y-8">
                <div className=' relative flex flex-col items-center space-y-8'>
                  <Image src='/flashcard.png' width={300} height={300} alt='flashcard' className='absolute top-20 -left-40 hidden md:block' />
                  <Image src='/flashcard.png' width={150} height={150} alt='flashcard' className='absolute bottom-20 -right-10 md:hidden' />
                  <div>
                    <p className='text-5xl md:text-8xl text-left md:text-center'>Make Flashcards</p>
                    <p className='text-5xl md:text-8xl text-left md:text-center'>Multiplayer</p>
                  </div>
                  <Image src='/game-controller.png' width={300} height={300} alt='game-controller' className='absolute -right-40 bottom-40 hidden md:block' />
                  <Image src='/game-controller.png' width={150} height={150} alt='game-controller' className='absolute bottom-40 -left-10 md:hidden' />
                </div>
                <div className='pt-32'>
                  <p className='text-xl md:text-3xl text-gray-400'>We make it easier to learn on the internet by making it fun, interactive, and co-oop.</p>
                </div>
                <div className='flex flex-row space-x-2 items-center'>
                  <button onClick={() => router.push('/home')} className="py-4 px-5 text-xl inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-orange-400 text-gray hover:bg-gradient-to-r from-amber-200 to-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">Enter the app</button>
                </div>
              </div>
              <div className='h-full mx-auto pb-10 w-full flex justify-center'>
                <div className='md:grid md:grid-cols-3 md:gap-3 space-y-3 max-w-7xl'>
                  <div className='flex justify-center'>
                    <Card className='bg-amber-100 w-full h-full max-w-md'>
                      <CardHeader>
                        <div className='w-full'>
                          <div className='flex justify-between bg-amber-200 '>
                            <p className='text-4xl text-center w-10 font-semibold p-4'>Gamify your learning</p>
                            <Image src='/arcade-machine.png' width={300} height={300} alt='arcade-machine' />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle>Make learning fun by playing games.</CardTitle>
                        <CardDescription>Coming soon!</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                  <div className='flex justify-center'>
                    <Card className='bg-amber-100 max-w-md w-full h-full'>
                      <CardHeader>
                        <div className='w-full'>
                          <div className='bg-amber-200 h-56 relative'>
                            <Image src='/dashboard.png' width={300} height={300} alt='dashboard' />
                            <p className='text-4xl text-center absolute w-full font-semibold p-4 -top-5'>Track your progress</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle>Check the dashboard to find weak subjects and personal growth</CardTitle>
                        <CardDescription>Coming soon!</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                  <div className='flex justify-center'>
                    <Card className='bg-amber-100 w-full h-full max-w-md'>
                      <CardHeader>
                        <div className='w-full'>
                          <div className='flex justify-between bg-amber-200 p-2 h-56 items-center'>
                            <p className='text-4xl text-center align-center w-10 font-semibold p-4'>Beat the Algorithm</p>
                            <Image src='/trophy.png' width={200} height={200} alt='trophy' className='object-contain' />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle>Instead of following the spaced repetition algorithm, we focus on evolving past it.</CardTitle>
                      </CardContent>
                    </Card>
                  </div>
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