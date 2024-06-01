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
import { SignInButton, useSignIn } from '@farcaster/auth-kit';
import { toast } from 'sonner';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useProfileContext } from '../../context';
import { useAccount } from 'wagmi';

export default function ProfileCreate({ setHasProfile }) {
    const [showCreateProfile, setShowCreateProfile] = useState(false)
    const { setCreatedProfile } = useProfileContext();
    const { address } = useAccount()

    const QUERY_IDEALITE_STATS = gql`
    query queryIdealiteStats($where: IdealiteStatsv1ObjectFilterInput = {}) {
        idealiteStatsv1Index(filters: {where: $where}, first: 10) {
          edges {
            node {
              id
            }
          }
        }
      }
`
    const [sendQueryIdealiteStats] = useLazyQuery(QUERY_IDEALITE_STATS);

    const queryIdealiteStats = async (farcasterId, publicKey, idealiteProfileId) => {
        //Dynamically create the filter
        let filter = {};

        if (farcasterId) {
            filter.farcasterId = { equalTo: farcasterId };
        }

        if (publicKey) {
            filter.publicKey = { equalTo: publicKey };
        }

        try {
            const { data } = await sendQueryIdealiteStats({
                variables: {
                    where: filter
                }
            });

            //If the user does not have an idealiteStats, then create it, else update it. 
            if (data.idealiteStatsv1Index.edges.length === 0) {
                await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/idealiteStats`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        farcasterId: farcasterId,
                        publicKey: publicKey,
                        idealiteProfileId: idealiteProfileId,
                    }),
                })
            } else {
                const idealiteStatsId = data.idealiteStatsv1Index.edges[0].node.id
                await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/idealiteStats`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        farcasterId: farcasterId,
                        publicKey: publicKey,
                        idealiteProfileId: idealiteProfileId,
                        idealiteStatsId: idealiteStatsId
                    }),
                })
            }
            // setHasProfile(true)
        } catch (error) {
            console.error('Error during query execution:', error.message);
        }
    }

    const CREATE_IDEALITE_PROFILE = gql`
    mutation createIdealiteProfile ($input: CreateIdealiteProfilev1Input!) {
        createIdealiteProfilev1(input: $input) {
        document {
            id
            displayName
            bio
            farcasterId
        }
        }
    }
`

    const [createProfileWithFarcaster] = useMutation(CREATE_IDEALITE_PROFILE, {
        // onCompleted: (data) => {
        //     if (data && data.createIdealiteProfilev1.document) {
        //         const id = data.createIdealiteProfilev1.document.id
        //         const newDisplayName = data.createIdealiteProfilev1.document.displayName
        //         const newBio = data.createIdealiteProfilev1.document.bio
        //         //add the fid here. 
        //         setCreatedProfile(id, newBio, newDisplayName, farcasterId)
        //     }
        // },
        onError: (error) => {
            toast.error('Error creating profile')
            console.log(error.message)
            return
        }
    });

    const handleSignInSuccess = async (fid, userName, bio, pfpUrl) => {
        const fidString = fid.toString()
        try {
            let profileContent = {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                displayName: userName,
                bio: bio,
                avatarCid: pfpUrl,
                farcasterId: fidString
            }

            for (const key in profileContent) {
                if (profileContent[key] === undefined || profileContent[key] === null || profileContent[key] === "") {
                    delete profileContent[key];
                }
            }

            const { data } = await createProfileWithFarcaster({
                variables: {
                    input: {
                        content: profileContent
                    }
                }
            })

            const {
                id: idealiteProfileId,
                bio: newBio,
                displayName: newDisplayName,
                farcasterId
            } = data.createIdealiteProfilev1.document
            const idealiteStatsData = await queryIdealiteStats(fidString, address, idealiteProfileId)
            console.log('idealiteStatsData', idealiteStatsData)
            setCreatedProfile(idealiteProfileId, newBio, newDisplayName, farcasterId)

        } catch (error) {
            toast.error('Error creating profile with Farcaster')
            console.log(error.message)
            return
        }
    }

    return (
        <div className='flex justify-center w-2/3 h-fit'>
            {showCreateProfile ?
                <ProfileCreateForm setShowCreateProfile={setShowCreateProfile} setHasProfile={setHasProfile} />
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
                                        onSuccess={({ fid, username, bio, pfpUrl }) => {
                                            handleSignInSuccess(fid, username, bio, pfpUrl)
                                        }
                                        }
                                        onError={(error) => console.log('Error: ', error)}
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