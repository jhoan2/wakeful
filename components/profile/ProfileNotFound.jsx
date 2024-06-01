import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ProfileCreateForm from './ProfileCreateForm';
import '@farcaster/auth-kit/styles.css';
import { SignInButton } from '@farcaster/auth-kit';
import { toast } from 'sonner';

export default function ProfileNotFound({
    setHasProfile,
    avatarFallback,
    farcasterProfile,
    setFarcasterProfile
}) {
    const [showCreateProfile, setShowCreateProfile] = useState(false)

    return (
        <div className='flex justify-center w-2/3 h-fit'>
            {showCreateProfile ?
                <ProfileCreateForm
                    setShowCreateProfile={setShowCreateProfile}
                    setHasProfile={setHasProfile}
                    farcasterProfile={farcasterProfile}
                    avatarFallback={avatarFallback}
                />
                :
                <Card className='w-2/3'>
                    <CardHeader>
                        <div className='flex justify-center'>
                            <UserRound className='bg-slate-200 border rounded-full w-24 h-24' />
                        </div>
                        <CardTitle className='flex justify-center'>Create your profile</CardTitle>
                        <CardDescription className='flex justify-center'>
                            It seems you haven't created a profile. Create one through Idealite or connect it with Farcaster.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex justify-center'>
                        <div className='flex justify-around w-full'>
                            <div className='w-full flex justify-center'>
                                <Button onClick={() => setShowCreateProfile(true)}>Create Profile</Button>
                            </div>
                            <div className='w-full'>
                                <div className='w-full flex justify-center'>
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
                                                    setShowCreateProfile(true)
                                            }
                                        }
                                    />
                                </div>
                                <div className='w-full '>
                                    <div className='w-full flex justify-center'>
                                        <p className='text-sm text-slate-600'>Don&apos;t have a Farcaster account?</p>
                                    </div>
                                    <div className='w-full flex justify-center'>
                                        <p className='text-sm text-slate-600'>Create one with this&nbsp;
                                            <a href="https://warpcast.com/~/invite-page/2070?id=ed161ad6"
                                                className='text-purple-700 underline underline-offset-2'>
                                                link
                                            </a>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            }
        </div>
    )
}
