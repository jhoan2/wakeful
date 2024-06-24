import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProfileEdit from './ProfileEdit';
import { SignInButton } from '@farcaster/auth-kit';
import { toast } from 'sonner';

export default function ProfileCard({
    avatarFallback,
    profile,
    farcasterProfile,
    setFarcasterProfile
}) {
    const [editProfile, setEditProfile] = useState(false)
    const [farcasterAuth, setFarcasterAuth] = useState(false)
    const { displayName, bio, avatarCid } = profile || {}
    const farcasterId = profile.farcasterId || ''


    return (
        <div className="max-w-2xl space-y-32 w-full mx-auto bg-white p-4 rounded-lg shadow">
            {editProfile ?
                <ProfileEdit
                    setEditProfile={setEditProfile}
                    profile={profile}
                    farcasterProfile={farcasterProfile}
                />
                :
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={avatarCid} />
                        <AvatarFallback className={`w-16 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 `}>
                            0x...{avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className='flex justify-between items-center'>
                            <div className='flex space-x-3'>
                                <p className="text-lg font-semibold text-gray-900">{displayName ? displayName : "No name yet."}</p>
                                {farcasterId ?
                                    <p
                                        variant='secondary'
                                        size='small'
                                        className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 pr-2 pl-2 bg-purple-200 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
                                    >
                                        fId: {farcasterId}
                                    </p>
                                    :
                                    null
                                }
                            </div>
                            <Button className="text-sm" variant="outline" onClick={() => setEditProfile(true)}>
                                Edit Profile
                            </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 max-h-30 overflow-auto">
                            {bio ? bio : "No bio yet."}
                        </p>
                    </div>

                </div>
            }
            {
                farcasterId || farcasterAuth ?
                    null
                    :
                    <div style={{ backgroundImage: "url(sign-in-with-farcaster-banner.png)", backgroundSize: 'cover' }} className='w-full h-1/3 rounded-lg hidden md:block'>
                        <div className="relative h-full w-64 font-mono left-10">
                            <div className="flex flex-col justify-center items-center pt-8  text-3xl w-64 text-purple-700">
                                <p className='font-extrabold'>Make learning social</p>
                                <p className='text-base pb-2'>
                                    Play games, challenge friends, and connect with fellow Idealites.
                                </p>
                                <SignInButton
                                    onError={
                                        (error) => {
                                            toast.error('Something went wrong signing in with Farcaster')
                                            console.log(error)
                                        }
                                    }
                                    onSuccess={
                                        ({ fid, username, bio, pfpUrl }) => {
                                            setFarcasterProfile({
                                                farcasterId: fid.toString(),
                                                displayName: username,
                                                bio: bio,
                                                avatarCid: pfpUrl
                                            }),
                                                setFarcasterAuth(true)
                                            setEditProfile(true)
                                        }
                                    }
                                />
                                <p className='text-xs text-slate-600 pt-2'>Don&apos;t have a Farcaster account?</p>
                                <p className='text-xs text-slate-600'>Create one with this&nbsp;
                                    <a href="https://warpcast.com/~/invite-page/2070?id=ed161ad6"
                                        className='text-purple-700 underline underline-offset-2'>
                                        link
                                    </a>.
                                </p>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}