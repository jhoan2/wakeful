import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { gql, useMutation } from '@apollo/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ProjectAdd() {
    const [open, setOpen] = useState(false)
    const formSchema = z.object({
        title: z.string().min(2).max(140),
        description: z.optional(z.string()),
        url: z.optional(z.string()),
        status: z.enum(["DONE", "DOING", "TODO", "DROPPED", "ARCHIVED"]),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: '',
            url: '',
            status: "TODO",
        },
    })

    const onSubmit = (values) => {
        let projectContent = {
            createdAt: new Date().toISOString(),
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

        createProject({
            variables: {
                input: {
                    content: projectContent
                }
            }
        })
    }

    const CREATE_IDEALITE_PROJECT = gql`
        mutation CREATE_IDEALITE_PROJECT($input: CreateIdealiteProjectv1Input!) {
            createIdealiteProjectv1(input: $input) {
                document {
                    id
                }
            }
        }`

    const [createProject, { loading, error }] = useMutation(CREATE_IDEALITE_PROJECT, {
        onCompleted: () => setOpen(false),
        refetchQueries: ['getUsersProjects'],
    });

    if (error) {
        toast.error("Oops, something went wrong!")
        console.log(error.message)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex"
                >
                    Add Projects
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Project</DialogTitle>
                    <DialogDescription>
                        Add a new project here. Click submit when you are done.
                    </DialogDescription>
                </DialogHeader>
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
                                            defaultValue={"TODO"}
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
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                            :
                            <Button type="submit" variant='secondary'>Submit</Button>
                        }
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
