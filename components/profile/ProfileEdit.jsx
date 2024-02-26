import React from 'react'
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

export default function ProfileEdit({ setEditProfile, avatarFallback, userProfile }) {
    const displayName = userProfile?.displayName || "Guest";
    const bio = userProfile?.bio || "No bio provided";
    const id = userProfile?.id
    const formSchema = z.object({
        displayName: z.string().min(2).max(240),
        bio: z.optional(z.string().min(2).max(240)),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            displayName: `${displayName}`,
            bio: `${bio}`,
        },
    })

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

        updateProfile({
            variables: {
                input: {
                    id: id,
                    content: profileContent
                }
            }
        })
    }

    const UPDATE_IDEALITE_PROFILE = gql`
        mutation MyMutation($input: UpdateIdealiteProfileInput!) {
            updateIdealiteProfile(input: $input) {
                document {
                    id
                }
            }
        }
        `

    const [updateProfile, { loading, error }] = useMutation(UPDATE_IDEALITE_PROFILE, {
        onCompleted: () => setEditProfile(false),
        refetchQueries: ['getUserProfile'],
    });

    if (error) {
        toast.error("Error updating profile.")
        console.log(error.message)
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
                    {loading ?
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
                            <Button type="submit" variant='secondary'>Submit</Button>
                        </div>
                    }
                </form>
            </Form>
        </div>
    )
}
