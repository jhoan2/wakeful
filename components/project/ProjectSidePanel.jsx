import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { gql, useMutation } from '@apollo/client';
import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


export default function ProjectSidePanel({ projectData }) {
    const [openProjectSidePanel, setOpenProjectSidePanel] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false);
    const {
        createdAt,
        title,
        updatedAt,
        status,
        url,
        description
    } = projectData

    const localeCreatedAt = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const localeUpdatedAt = new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const formSchema = z.object({
        title: z.string().min(2).max(140),
        description: z.optional(z.string()),
        url: z.optional(z.string()),
        status: z.enum(["DONE", "DOING", "TODO", "DROPPED", "ARCHIVED"]),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: `${title}`,
            description: `${description}`,
            url: `${url}`,
            status: `${status}`,
        },
    })

    const onSubmit = (values) => {
        let projectContent = {
            updatedAt: new Date().toISOString(),
            // cid: IpfsHash,
            // mimeType: image?.type,
            // pinSize: PinSize,
            status: values.status,
            url: values.url,
            title: values.title,
            description: values.description,
            deleted: false,
        }

        for (const key in projectContent) {
            if (projectContent[key] === undefined || projectContent[key] === null || projectContent[key] === "") {
                delete projectContent[key];
            }
        }

        updateProject({
            variables: {
                input: {
                    id: projectData.id,
                    content: projectContent
                }
            }
        })
    }

    const UPDATE_IDEALITE_PROJECT = gql`
    mutation updateUserIdealiteProject($input: UpdateIdealiteProjectv1Input!) {
        updateIdealiteProjectv1(input: $input) {
          document {
            id
          }
        }
      }
    `

    const [updateProject, { data, loading, error }] = useMutation(UPDATE_IDEALITE_PROJECT, {
        onCompleted: () => setOpenProjectSidePanel(false),
        // refetchQueries: ['getUsersProjects'],
    });

    if (error) {
        toast.error("Error updating project")
        console.log(error.message)
    }

    if (data) {
        toast.success("Project updated successfully")
    }

    return (
        <div>
            <button
                onClick={() => setOpenProjectSidePanel(!openProjectSidePanel)}
                className={`bg-gray-200 hover:bg-gray-300 text-gray-700 rounded fixed top-1/2  ease-in-out duration-300 transform -translate-y-1/2 z-50 ${openProjectSidePanel ? 'right-3/4 md:right-1/2' : 'right-0'}`}
                title={'Edit Resource'}
            >
                {openProjectSidePanel ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M10.0859 12.0001L5.29297 16.793L6.70718 18.2072L12.9143 12.0001L6.70718 5.79297L5.29297 7.20718L10.0859 12.0001ZM17.0001 6.00008L17.0001 18.0001H15.0001L15.0001 6.00008L17.0001 6.00008Z"></path></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg>
                }
            </button>
            <div
                className={`fixed top-0 right-0 w-3/4 md:w-1/2 h-full bg-white shadow-xl overflow-auto duration-300 ease-in-out ${openProjectSidePanel ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Panel content */}
                <div className="p-4">
                    {isEditOpen ?
                        <div className='space-y-4'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Description"
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Url</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Url" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={status}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="DONE" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Done
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="DOING" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Doing
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="TODO" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Todo</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="DROPPED" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Dropped</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="ARCHIVED" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Archived</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
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
                                            <button type="button" onClick={() => setIsEditOpen(!isEditOpen)} className="px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                                Cancel
                                            </button>
                                            <Button type="submit" variant='secondary'>Submit</Button>
                                        </div>
                                    }
                                </form>
                            </Form>
                            <div className='flex justify-between text-sm fixed bottom-0 left-0 right-0'>
                                <p>Created At: {localeCreatedAt}</p>
                                <p>Last Updated: {localeUpdatedAt}</p>
                            </div>
                        </div>
                        :
                        <div className='space-y-6'>
                            <Dialog>
                                <DialogHeader>
                                    <DialogTitle>{title}</DialogTitle>
                                    <DialogDescription>{description}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-1">
                                    <Label htmlFor="url">Url</Label>
                                    <Input id="url" defaultValue={`${url}`} disabled />
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <RadioGroup
                                        defaultValue={status}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="DONE" id="s1" />
                                            <Label htmlFor="s1">Done</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">

                                            <RadioGroupItem value="DOING" id="s2" />
                                            <Label htmlFor="s2">Doing</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="TODO" id="s3" />
                                            <Label htmlFor="s3">Todo</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="DROPPED" id="s4" />
                                            <Label htmlFor="s4">Dropped</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 space-y-0">
                                            <RadioGroupItem value="ARCHIVED" id="s5" />
                                            <Label htmlFor="s5">Archived</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                            </Dialog>
                            <Button variant='secondary' onClick={() => setIsEditOpen(!isEditOpen)} className='text-blue-600'>Edit</Button>
                            <div className='flex justify-between text-sm fixed bottom-0 left-0 right-0'>
                                <p>Created At: {localeCreatedAt}</p>
                                <p>Last Updated: {localeUpdatedAt}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}
