import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfileCard({ setEditProfile, avatarFallback, userProfile }) {
    const { displayName, bio } = userProfile || {}
    return (
        <div className="max-w-2xl w-full md:w-2/3 mx-auto bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage />
                    <AvatarFallback className={`w-16 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 `}>
                        0x...{avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className='flex justify-between items-center'>
                        <p className="text-lg font-semibold text-gray-900">{displayName ? displayName : "No name yet."}</p>
                        <Button className="text-sm" variant="outline" onClick={() => setEditProfile(true)}>
                            Edit Profile
                        </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 max-h-30 overflow-auto">
                        {bio ? bio : "No bio yet."}
                    </p>
                </div>

            </div>
        </div>
    )
}
