import React from 'react'
import Link from 'next/link'
export default function HomeCard({ resource }) {
    const { id, title, cid, updatedAt } = resource.node.resource
    const localeUpdatedAt = new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    return (
        <Link href={`/resource/${id}`} className="m-3 flex flex-col bg-white border shadow-sm rounded-xl min-w-[330px] max-w-[330px] group hover:shadow-lg transition dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            {!cid ?
                <div className="relative pt-[50%] rounded-t-xl overflow-hidden">
                    <div className="w-full h-full absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-t-xl"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #ff9966, #ff5e62)',
                            backgroundSize: 'cover'
                        }}
                    >
                    </div>
                </div>
                :
                <div className="relative pt-[50%]  rounded-t-xl overflow-hidden">
                    <img className="w-full h-full absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out rounded-t-xl"
                        src={`https://purple-defensive-anglerfish-674.mypinata.cloud/ipfs/${cid}?img-width=384`}
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null; //prevent looping
                            currentTarget.src = '/placeholder-img.png'
                        }}
                        crossOrigin='anonymous'
                        alt="Image Description" />
                </div>
            }


            <div className="p-4 md:p-5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {title}
                </h3>
                <p className="mt-5 text-xs text-gray-500 dark:text-gray-500">
                    Updated at: {localeUpdatedAt}
                </p>
            </div>
        </Link>
    )
}
