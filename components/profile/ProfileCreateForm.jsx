import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { useProfileContext } from '../../context';
import { useAccount } from 'wagmi';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileCreateForm({ setShowCreateProfile, setHasProfile, farcasterProfile, avatarFallback }) {
    const [loadingCreateProfile, setLoadingCreateProfile] = useState(false);
    const [nameInputValue, setNameInputValue] = useState('')
    const [bioInputValue, setBioInputValue] = useState('')
    const { setCreatedProfile } = useProfileContext();
    const { address } = useAccount();

    const formSchema = z.object({
        displayName: z.string().trim().min(2).max(240),
        bio: z.optional(z.string().trim().min(2).max(240)),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: ``,
            bio: ``,
        },
    })

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
        } else {
            filter.publicKey = { equalTo: publicKey };
        }

        try {
            sendQueryIdealiteStats({
                variables: {
                    where: filter
                }
            }).then((data) => {
                //If the user does not have an idealiteStats, then create it, else update it. 
                if (data?.data?.idealiteStatsv1Index?.edges.length === 0) {
                    fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/idealiteStats`, {
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
                    const idealiteStatsId = data?.data?.idealiteStatsv1Index?.edges[0]?.node?.id
                    fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/idealiteStats`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                            farcasterId: farcasterId,
                            publicKey: publicKey,
                            idealiteProfileId: idealiteProfileId,
                            idealiteStatsId: idealiteStatsId
                        }),
                    })
                }
            })
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
            }
            }
        }
    `

    const [createProfile] = useMutation(CREATE_IDEALITE_PROFILE, {
        onError: (error) => {
            toast.error('Error creating profile')
            console.log(error.message)
            setLoadingCreateProfile(false)
            return
        }
    });

    const onSubmit = async (values) => {
        try {
            let profileContent = {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                displayName: values.displayName,
                bio: values.bio,
                avatarCid: farcasterProfile?.avatarCid,
                farcasterId: farcasterProfile?.farcasterId
            }

            for (const key in profileContent) {
                if (profileContent[key] === undefined || profileContent[key] === null || profileContent[key] === "") {
                    delete profileContent[key];
                }
            }
            setLoadingCreateProfile(true)

            const { data } = await createProfile({
                variables: {
                    input: {
                        content: profileContent
                    }
                }
            })

            const { id: idealiteProfileId, bio, displayName } = data.createIdealiteProfilev1.document
            await queryIdealiteStats(farcasterProfile?.farcasterId, address, idealiteProfileId)
            setCreatedProfile(idealiteProfileId, bio, displayName, farcasterProfile?.farcasterId)
            setHasProfile(true)
        } catch (error) {
            toast.error('Error creating profile')
            console.log(error.message)
            return
        } finally {
            setLoadingCreateProfile(false)
        }
    }

    const handleDisplayNameChange = (value) => {
        setNameInputValue(value);
        form.setValue('displayName', value);
    };

    const handleBioChange = (value) => {
        setBioInputValue(value);
        form.setValue('bio', value);
    };

    useEffect(() => {
        if (farcasterProfile !== null) {
            handleDisplayNameChange(farcasterProfile.displayName)
            handleBioChange(farcasterProfile.bio)
        }
    }, [farcasterProfile])

    return (
        <Card className='w-2/3'>
            <CardHeader>
                <CardTitle className='flex justify-center'>Create Profile</CardTitle>
                {farcasterProfile ?
                    <div className='flex justify-center'>
                        <Avatar>
                            <AvatarImage src={farcasterProfile.avatarCid} />
                            <AvatarFallback className={`w-16 h-16 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 `}>
                                0x...{avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    :
                    null
                }
                <CardDescription className='flex justify-center'>
                </CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center w-full'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Type display name here."
                                            {...field}
                                            autoComplete='off'
                                            value={nameInputValue}
                                            onChange={(e) => handleDisplayNameChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <div className="flex justify-end text-xs">
                                        {nameInputValue.length}/240 characters
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type bio here."
                                            className="resize-none"
                                            autoComplete='off'
                                            {...field}
                                            value={bioInputValue}
                                            onChange={(e) => handleBioChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <div className="flex justify-end text-xs">
                                        {bioInputValue.length}/240 characters
                                    </div>
                                </FormItem>
                            )}
                        />
                        {loadingCreateProfile ?
                            <div className="flex justify-end">
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            </div>
                            :
                            <div className='flex justify-between'>
                                <button type="button" onClick={() => setShowCreateProfile(false)} className="px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                    Cancel
                                </button>
                                {
                                    loadingCreateProfile ?
                                        <Button type="button" variant='secondary'>Submitting...</Button>
                                        :
                                        <Button type="submit" variant='secondary'>Submit</Button>

                                }
                            </div>
                        }
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}