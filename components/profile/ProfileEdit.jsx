import React, { useState } from 'react'
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

export default function ProfileEdit({ setEditProfile, avatarFallback, profile }) {
    const [loadingProfile, setLoadingProfile] = useState(false)
    const displayName = profile?.displayName || "Guest";
    const bio = profile?.bio || "No bio provided";
    const id = profile?.id;
    const { setCreatedProfile, updateProfileBioAndName } = useProfileContext();

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
    mutation MyMutation($input: UpdateIdealiteProfileInput!) {
        updateIdealiteProfile(input: $input) {
            document {
                id
                bio
                displayName
            }
        }
    }
`

    const [updateProfile,
        {
            loading: loadingUpdatingProfile,
            error: errorUpdatingProfile,
        }] = useMutation(UPDATE_IDEALITE_PROFILE, {
            onCompleted: (data) => {
                if (data) {
                    const newDisplayName = data.updateIdealiteProfile.document.displayName
                    const newBio = data.updateIdealiteProfile.document.bio
                    updateProfileBioAndName(newBio, newDisplayName)
                }
                setEditProfile(false)
            },
        });

    const CREATE_IDEALITE_PROFILE = gql`
    mutation MyMutation ($input: CreateIdealiteProfileInput!) {
        createIdealiteProfile(input: $input) {
          document {
            id
            displayName
            bio
          }
        }
      }
        `

    const [createProfile,
        {
            loading: loadingCreatingProfile,
            error: errorCreatingProfile,
        }] = useMutation(CREATE_IDEALITE_PROFILE, {
            onCompleted: (data) => {
                if (data && data.createIdealiteProfile.document) {
                    const id = data.createIdealiteProfile.document.id
                    const newDisplayName = data.createIdealiteProfile.document.displayName
                    const newBio = data.createIdealiteProfile.document.bio
                    setCreatedProfile(id, newBio, newDisplayName)
                }
                setEditProfile(false)
            },
        });

    const onSubmit = (values) => {
        let profileContent = {
            updatedAt: new Date().toISOString(),
            displayName: values.displayName,
            bio: values.bio,
        }

        for (const key in profileContent) {
            if (profileContent[key] === undefined || profileContent[key] === null || profileContent[key] === "") {
                delete profileContent[key];
            }
        }

        if (!profile.id) {
            setLoadingProfile(true)

            createProfile({
                variables: {
                    input: {
                        content: profileContent
                    }
                }
            })

            //Potentially, doesn't work. 
            if (errorCreatingProfile) {
                toast.error('Error creating profile')
                console.log(errorCreatingProfile.message)
            }

            setLoadingProfile(false)
        } else {
            setLoadingProfile(true)

            updateProfile({
                variables: {
                    input: {
                        id: id,
                        content: profileContent
                    }
                }
            })

            //Potentially, doesn't work.
            if (errorUpdatingProfile) {
                toast.error("Error updating profile.")
                console.log(errorUpdatingProfile.message)
            }
        }
        setLoadingProfile(false)
    }


    return (
        <div className="max-w-2xl w-full md:w-2/3 mx-auto bg-white p-4 rounded-lg shadow">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
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
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
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
                                loadingUpdatingProfile || loadingCreatingProfile ?
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
