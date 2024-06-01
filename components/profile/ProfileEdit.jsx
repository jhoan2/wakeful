import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
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
import { gql, useMutation } from '@apollo/client';
import { useProfileContext } from '../../context';

export default function ProfileEdit({ setEditProfile, profile, farcasterProfile }) {
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [nameInputValue, setNameInputValue] = useState(profile.displayName)
    const [bioInputValue, setBioInputValue] = useState(profile.bio)
    const displayName = profile?.displayName || "Guest";
    const bio = profile?.bio || "No bio provided";
    const id = profile?.id;
    const { updateProfileBioAndName, setCreatedProfile } = useProfileContext();

    const formSchema = z.object({
        displayName: z.string().trim().min(2).max(240),
        bio: z.optional(z.string().trim().min(2).max(240)),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: `${displayName}`,
            bio: `${bio}`,
        },
    })

    const UPDATE_IDEALITE_PROFILE = gql`
    mutation updateIdealiteProfile($input: UpdateIdealiteProfilev1Input!) {
        updateIdealiteProfilev1(input: $input) {
            document {
                id
                bio
                displayName
                farcasterId
                avatarCid
            }
        }
    }
`

    const [updateProfile,
        {
            loading: loadingUpdatingProfile,
        }] = useMutation(UPDATE_IDEALITE_PROFILE, {
            onCompleted: (data) => {
                if (!data.updateIdealiteProfilev1.document.farcasterId) {
                    const newDisplayName = data.updateIdealiteProfilev1.document.displayName
                    const newBio = data.updateIdealiteProfilev1.document.bio
                    updateProfileBioAndName(newBio, newDisplayName)
                } else {
                    const { id, bio, displayName, farcasterId, avatarCid } = data.updateIdealiteProfilev1.document
                    setCreatedProfile(id, bio, displayName, farcasterId, avatarCid)
                }
                setEditProfile(false)
            },
            onError: (error) => {
                console.log(error.message)
                toast.error('Error updating profile')
                return
            }
        });

    const onSubmit = (values) => {
        let profileContent = {
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

        setLoadingProfile(true)

        updateProfile({
            variables: {
                input: {
                    id: id,
                    content: profileContent
                }
            }
        })

        setLoadingProfile(false)
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
        <div className="max-w-2xl w-full mx-auto bg-white p-4 rounded-lg shadow">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Name"
                                        {...field}
                                        value={nameInputValue}
                                        onChange={(e) => handleDisplayNameChange(e.target.value)}
                                        autoComplete='off'
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
                                        placeholder="Bio"
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
                    {loadingProfile ?
                        <div className="flex justify-end">
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        </div>
                        :
                        <div className='flex justify-between'>
                            <button type="button" onClick={() => setEditProfile(false)} className="px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                Cancel
                            </button>
                            {
                                loadingUpdatingProfile ?
                                    <Button type="button" variant='secondary'>Submitting...</Button>
                                    :
                                    <Button type="submit" variant='secondary'>Submit</Button>
                            }
                        </div>
                    }
                </form>
            </Form>
        </div>
    )
}
