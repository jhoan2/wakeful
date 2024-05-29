import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function About() {
    const router = useRouter();

    return (
        <div>
            <nav className="flex h-9 items-center justify-between m-3 rounded-full bg-gray-100 p-9 space-x-2 " aria-label="Global">
                <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
                    <Image src='/icon128.png' width={32} height={32} alt='idealite logo' />
                    <h2 onClick={() => router.push('/')} className="text-4xl font-semibold text-gray-800 dark:text-white hover:text-amber-400 hover:cursor-pointer">
                        Idealite
                    </h2>
                </div>
                <div className='w-1/4'>
                    <p className='text-xl underline underline-offset-2 text-amber-400'>About</p>
                </div>
            </nav>
            <section className="relative w-full h-[70vh] flex items-center justify-start bg-[url('/golden-mandala.png')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gray-700/70 z-0" />
                <div className="relative z-10 space-y-6 max-w-3xl px-4 sm:px-6 md:px-8 text-left">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">Mission, Values, & Vision</h1>
                    <p className="text-lg text-gray-300 md:text-xl">
                        Idealite is a digitally native education network whose mission is to set us free to advance toward a future bound by meaning and led by love.
                    </p>
                </div>
            </section>
            {/* Small Screens */}
            <div className='space-y-6 shadow-md bg-gray-700/70 text-white md:hidden'>
                <div className='max-w-2xl  w-full mx-auto p-6'>
                    <h2 className='text-3xl mb-4 font-bold'>Problem</h2>
                    <p className='mb-4 text-2xl'>It's too hard to learn on the internet.</p>
                    <ul className='text-xl list-disc pl-6'>
                        <li>It's isolating</li>
                        <li>It's hard to see progress</li>
                        <li>The credentials from the internet have no value.</li>
                    </ul>
                </div>
                <div className='max-w-2xl  w-full mx-auto p-6'>
                    <h2 className='text-3xl mb-4 font-bold'>Solution --&gt; Networks</h2>
                    <p className='mb-4 text-2xl'>Networks work</p>
                    <ul className='text-xl list-disc pl-6'>
                        <li>Twitter &gt; Traditional media</li>
                        <li>LinkedIn &gt; Yellow pages</li>
                        <li>Uber &gt; Yellow taxi cabs</li>
                    </ul>
                </div>
                <div className='max-w-2xl  w-full mx-auto p-6 space-y-4'>
                    <p className='mb-4 text-2xl'>Education networks on the internet tend to be small</p>
                    <p className='text-xl p-2'>Web 2.0 networks tend to be centralized and benefit the few. This limits the size of the network.</p>
                    <div className='flex justify-center'>
                        <Image src={'/spoke-and-wheel.png'} width={300} height={300} className='rounded-lg' alt='Web 2.0 network' />
                    </div>
                    <p className='text-xl p-2'>Web 2.0 networks tend to be extractive which disincentivizes creators and developers to build on top.</p>
                    <div className='flex justify-center'>
                        <Image src={'/web2-take-rates.png'} width={300} height={300} className='rounded-lg' alt='Web 2.0 take rates.' />
                    </div>
                </div>
                <div className='max-w-2xl  w-full mx-auto p-6 space-y-4'>
                    <p className='mb-4 text-2xl'>Blockchain networks are bigger</p>
                    <p className='text-xl p-2'>Blockchain networks benefit the many by giving ownership to its community</p>
                    <div className='flex justify-center'>
                        <Image src={'/blockchain-network.png'} width={300} height={300} className='rounded-lg' alt='Blockchain network' />
                    </div>
                    <p className='text-xl p-2'>Blockchain networks have lower take rates</p>
                    <div className='flex justify-center'>
                        <Image src={'/web3-take-rates.png'} width={300} height={300} className='rounded-lg' alt='Web 3.0 take rates.' />
                    </div>
                </div>
                <div className='max-w-2xl  w-full mx-auto p-6'>
                    <p className='mb-4 text-2xl'>Bigger Networks are better.</p>
                    <ul className='text-xl list-disc pl-6'>
                        <li>It will be easier to find learners with similar goals and interests.</li>
                        <li>It will be easier to see progress relative to others.</li>
                        <li>The credential will carry more weight.</li>
                    </ul>
                </div>
                <div className='max-w-2xl  w-full mx-auto pt-6'>
                    <p className='text-2xl p-2'>Education networks have value</p>
                    <div className='flex justify-center items-center p-4'>
                        <Image src={'/education-networks-are-valuable.png'} width={500} height={500} className='rounded-lg' alt='Education networks are valuable.' />
                    </div>
                </div>
                <div className='max-w-2xl  w-full mx-auto p-6'>
                    <p className='mb-4 text-2xl'>Risk factor(s): AI</p>
                    <ul className='text-xl list-disc pl-6'>
                        <li>Term education comes from educe which means to draw out something latent</li>
                        <li>Latent potential exists in the unknown</li>
                        <li>AI is not AGI, therefore is limited by what is known.</li>
                        <li>Being led by the known, does not translate to unconvering the unknown.</li>
                        <li>AI may support education, but it cannot lead it.</li>
                    </ul>
                </div>
            </div>
            {/* Medium Screens */}
            <div className='flex flex-col justify-center items-center flex-grow space-y-6 shadow-md bg-gray-700/70 text-white hidden md:block'>
                <div className='max-w-2xl  w-full mx-auto pt-6 pl-6'>
                    <h2 className='text-3xl mb-4 font-bold'>Problem</h2>
                    <p className='mb-4 text-2xl'>It's too hard to learn on the internet.</p>
                    <ul className='text-xl list-disc pl-6'>
                        <li>It's isolating</li>
                        <li>It's hard to see progress</li>
                        <li>The credentials from the internet have no value.</li>
                    </ul>
                </div>
                <div className='max-w-2xl  w-full mx-auto pt-6 pl-6'>
                    <h2 className='text-3xl mb-4 font-bold'>Solution --&gt; Networks</h2>
                    <p className='mb-4 text-2xl'>Networks work</p>
                    <ul className='text-xl list-disc pl-6'>
                        <li>Twitter &gt; Traditional media</li>
                        <li>LinkedIn &gt; Yellow pages</li>
                        <li>Uber &gt; Yellow taxi cabs</li>
                    </ul>
                </div>
                <div className='max-w-2xl  w-full mx-auto pt-6 pl-6 space-y-4'>
                    <p className='mb-4 text-2xl'>Education networks on the internet tend to be small</p>
                    <div className='flex'>
                        <p className='text-xl p-2'>Web 2.0 networks tend to be centralized and benefit the few. This limits the size of the network.</p>
                        <Image src={'/spoke-and-wheel.png'} width={300} height={300} className='rounded-lg' alt='Web 2.0 network' />
                    </div>
                    <div className='flex'>
                        <p className='text-xl p-2'>Web 2.0 networks tend to be extractive which disincentivizes creators and developers to build on top.</p>
                        <Image src={'/web2-take-rates.png'} width={300} height={300} className='rounded-lg' alt='Web 2.0 take rates.' />
                    </div>
                </div>
                <div className='max-w-2xl  w-full mx-auto pt-6 pl-6 space-y-4'>
                    <p className='mb-4 text-2xl'>Blockchain networks are bigger</p>
                    <div className='flex'>
                        <p className='text-xl p-2'>Blockchain networks benefit the many by giving ownership to its community</p>
                        <Image src={'/blockchain-network.png'} width={300} height={300} className='rounded-lg' alt='Blockchain network' />
                    </div>
                    <div className='flex'>
                        <p className='text-xl p-2'>Blockchain networks have lower take rates</p>
                        <Image src={'/web3-take-rates.png'} width={300} height={300} className='rounded-lg' alt='Web 3.0 take rates.' />
                    </div>
                </div>
                <div className='max-w-2xl  w-full mx-auto pt-6 pl-6'>
                    <p className='mb-4 text-2xl'>Bigger Networks are better.</p>
                    <ul className='text-xl list-disc pl-6'>
                        <li>It will be easier to find learners with similar goals and interests.</li>
                        <li>It will be easier to see progress relative to others.</li>
                        <li>The credential will carry more weight.</li>
                    </ul>
                </div>
                <div className='max-w-2xl  w-full mx-auto pt-6 pl-6'>
                    <p className='text-2xl p-2'>Education networks have value</p>
                    <div className='flex justify-center items-center'>
                        <Image src={'/education-networks-are-valuable.png'} width={500} height={500} className='rounded-lg' alt='Education networks are valuable.' />
                    </div>
                </div>
                <div className='max-w-2xl  w-full mx-auto pt-6 pl-6 pb-10'>
                    <p className='mb-4 text-2xl'>Risk factor(s): AI</p>
                    <ul className='text-xl list-disc pl-6'>
                        <li>Term education comes from educe which means to draw out something latent</li>
                        <li>Latent potential exists in the unknown</li>
                        <li>AI is not AGI, therefore is limited by what is known.</li>
                        <li>Being led by the known, does not translate to unconvering the unknown.</li>
                        <li>AI may support education, but it cannot lead it.</li>
                    </ul>
                </div>
            </div>
        </div>


    )
}
