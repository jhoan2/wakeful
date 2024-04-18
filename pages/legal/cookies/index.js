import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Cookies() {
    const router = useRouter();

    return (
        <div className="-z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fde68a_40%,#facc15_100%)]">
            <div className="h-full px-6 pt-6 lg:px-8">
                <div className='flex flex-col justify-center'>
                    <nav className="flex h-9 items-center justify-between m-3" aria-label="Global">
                        <div className="flex lg:min-w-0 lg:flex-1 rounded-full bg-gray-100 p-2 space-x-2" aria-label="Global">
                            <Image src='/icon128.png' width={32} height={32} alt='idealite logo' className='hover:cursor-pointer' onClick={() => router.push('/')} />
                            <h2 className="text-4xl font-semibold text-gray-800 dark:text-white hover:cursor-pointer" onClick={() => router.push('/')}>Idealite</h2>
                        </div>
                    </nav>
                    <main className='flex justify-center w-full min-h-screen'>
                        <div className='w-2/3 space-y-4'>
                            <h1 className='text-3xl'>Cookie Policy</h1>
                            <h2 className='text-2xl'>Cookies</h2>
                            <p>This website uses cookies, so that you can use our website at any time easily and without delay.</p>
                            <p>You can revoke your consent to the use of cookies here: Revoke cookies</p>
                            <h2 className='text-2xl'>Google Analytics</h2>
                            <p>This website uses Google Analytics, a web analysis service from Google Inc. (" Google "). Google Analytics uses so-called. "Cookies" , text files that are stored on your computer and an analysis of the use of the website by you enables. The information generated by the cookie about your Use of this website (including your IP address) will be accepted transferred to a Google server in the USA and there saved. Google will use this information to track your Evaluate the use of the website in order to generate reports on the To compile website activities for the website operator and to more with website usage and internet usage to provide related services. Google will do this too Information may be transferred to third parties if this is the case required by law or as far as third parties provide this data in Process order from Google. In no case will Google become yours Connect the IP address with other Google data. you the installation of cookies can be activated by a corresponding Prevent setting your browser software; we will show you however, if this happens, you may not be able to be able to use all functions of this website to their full extent. By using this website you agree to the Processing of the data collected about you by Google in the previously described manner and for the aforementioned purpose I Agree.</p>
                        </div>
                    </main>
                </div>
            </div >
            <footer className='flex justify-center items-center h-full max-h-16'>
                <div className='flex space-x-4 jsutify-center items-center'>
                    <p className='hover:text-amber-400 hover:cursor-pointer' onClick={() => router.push('/legal/privacy')}>Privacy Policy</p>
                    <p className='hover:text-amber-400 hover:cursor-pointer' onClick={() => router.push('/legal/terms')}>Terms & Conditions</p>
                    <p className='hover:text-amber-400 hover:cursor-pointer' onClick={() => router.push('/legal/cookies')}>Cookies</p>
                </div>
            </footer>
        </div >
    )
}