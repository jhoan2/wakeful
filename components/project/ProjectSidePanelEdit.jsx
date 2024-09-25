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

export default function ProjectSidePanelEdit({
    title,
    description,
    url,
    status,
    createdAt,
    updatedAt,
    projectId,
    setActiveView,
    setOpenProjectSidePanel
}) {

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
        url: z.string().optional(),
        status: z.enum(["DONE", "DOING", "TODO", "DROPPED", "ARCHIVED"]),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title,
            description: description,
            url: url || '',
            status: status,
        },
    })

    const onSubmit = (values) => {
        let projectContent = {
            updatedAt: new Date().toISOString(),
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
                    id: projectId,
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
    });

    if (error) {
        toast.error("Error updating project")
        console.log(error.message)
    }

    return (
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
                                <FormLabel>Resource Url</FormLabel>
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
                            <button type="button" onClick={() => setActiveView('details')} className="px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
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
    )
}
