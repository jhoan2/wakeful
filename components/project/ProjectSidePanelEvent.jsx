import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { InfoIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from 'lucide-react';
import { useCeramicContext } from '../../context';
import { useProfileContext } from '../../context';
import { Label } from "@/components/ui/label";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import ContextMenuTree from '../ContextMenuTree';
import ProjectTagGroup from './ProjectTagGroup';
import { gql, useMutation } from '@apollo/client';
import Image from 'next/image';


export default function ProjectSidePanelEvent({ title, description, projectId, url, setActiveView, tags, category }) {
    const [loadingCreateEvent, setLoadingCreateEvent] = useState(false)
    const clients = useCeramicContext()
    const { composeClient } = clients;
    const { profile } = useProfileContext()
    const [inputImage, setInputImage] = useState(false)
    const [image, setImage] = useState(null);

    const formSchema = z.object({
        title: z.string().min(2).max(140),
        description: z.string(),
        startTimestamp: z.date(),
        endTimestamp: z.date(),
        url: z.string().optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title || "",
            description: description || '',
        },
    });

    const UPDATE_IDEALITE_PROJECT = gql`
        mutation updateIdealiteProject($input: UpdateIdealiteProjectv1Input = {id: "", content: {eventChildId: ""}}) {
            updateIdealiteProjectv1(input: $input) {
                document {
                    id
                }
            }
        }
    `

    const [updateProject] = useMutation(UPDATE_IDEALITE_PROJECT, {
        refetchQueries: ['getUsersProjectCardCollection'],
        onError: (error) => console.error(error.message)
    });

    const [updateProjectTitle] = useMutation(UPDATE_IDEALITE_PROJECT, {
        refetchQueries: ['getProjectTitle'],
        onError: (error) => console.error(error.message)
    });

    const pinFileToIPFS = async (file) => {
        const formData = new FormData();
        formData.set('file', file)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/cardImage`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const { pinataData } = data;
            return pinataData;
        } catch (error) {
            console.log(error.message);
        }
    }

    const handlePaste = (event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData || !clipboardData.items.length) return;

        const item = clipboardData.items[0];
        if (!item.type.startsWith('image/')) {
            const inputElement = document.getElementById('paste-image');
            inputElement.value = '';
            return;
        };

        const file = item.getAsFile();
        setImage(file);
        const inputElement = document.getElementById('input-image');
        inputElement.disabled = true;
    }

    const submitEvent = async (values) => {
        setLoadingCreateEvent(true);
        let IpfsHash

        if (image) {
            const data = await pinFileToIPFS(image);
            IpfsHash = data?.IpfsHash;
        }

        let projectContent = {
            clientMutationId: composeClient.id,
            url: url,
            title: values.title,
            description: values.description,
            projectId: projectId,
            startTimestamp: values.startTimestamp.toISOString(),
            endTimestamp: values.endTimestamp.toISOString(),
            eventImage: IpfsHash,
            hostDisplayName: profile.displayName,
            hostFarcasterId: profile.farcasterId || '',
            hostAvatarCid: profile.avatarCid || '',
            tags: tags ? tags.edges.map(tag => tag.node.idealiteTag.id) : [],
        }

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectContent: projectContent
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            const data = await response.json();

            if (category === 'projectTitle') {
                updateProjectTitle({
                    variables: {
                        input: {
                            id: projectId,
                            content: {
                                eventChildId: data.newEventId.data.createIdealiteProjectv1.document.id
                            }
                        }
                    }
                })
            }

            if (category === 'project') {
                updateProject({
                    variables: {
                        input: {
                            id: projectId,
                            content: {
                                eventChildId: data.newEventId.data.createIdealiteProjectv1.document.id
                            }
                        }
                    }
                })
            }

            setActiveView('details');
        } catch (error) {
            console.error('Error creating event:', error);
        } finally {
            setLoadingCreateEvent(false);
        }
    }

    return (
        <div className='space-y-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitEvent)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Event Title" {...field} />
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
                                <div className="flex items-center space-x-2">
                                    <FormLabel>Description</FormLabel>
                                    <Popover>
                                        <PopoverTrigger>
                                            <InfoIcon className="h-4 w-4 cursor-pointer" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 p-2">
                                            <p className="text-sm">
                                                Tips for writing event descriptions:
                                                <ul className="list-disc pl-4 mt-2">
                                                    <li>What do you want to learn?</li>
                                                    <li>What does success look</li>
                                                    <li>Include key details like time, location, and purpose</li>
                                                    <li>Highlight any special requirements or expectations</li>
                                                    <li>Use a friendly and inviting tone</li>
                                                </ul>
                                            </p>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <FormControl>
                                    <Textarea
                                        placeholder="Event Description"
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
                    <div className="space-y-1">
                        <Label htmlFor="tags">Tags:</Label>
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] hover:bg-gray-100 transition-colors duration-200" title="Right-click to add tags">
                                    <ProjectTagGroup tags={tags.edges} category={category} />
                                </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent className='w-48'>
                                {profile.tags && profile.tags.length === 0 ?
                                    <p>No tags yet.</p>
                                    :
                                    <ContextMenuTree cardId={projectId} category={category} tags={tags} />
                                }
                            </ContextMenuContent>
                        </ContextMenu>

                    </div>
                    <div className="flex justify-between">
                        <FormField
                            control={form.control}
                            name="startTimestamp"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>End Date and Time</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[220px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP p")
                                                    ) : (
                                                        <span>Pick a date and time</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                            <div className="p-3">
                                                <Input
                                                    type="time"
                                                    value={field.value ? format(field.value, "HH:mm") : ""}
                                                    onChange={(e) => {
                                                        const [hours, minutes] = e.target.value.split(':');
                                                        const newDate = field.value ? new Date(field.value) : new Date();
                                                        newDate.setHours(parseInt(hours), parseInt(minutes));
                                                        field.onChange(newDate);
                                                    }}
                                                />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endTimestamp"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>End Date and Time</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[220px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP p")
                                                    ) : (
                                                        <span>Pick a date and time</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                            <div className="p-3">
                                                <Input
                                                    type="time"
                                                    value={field.value ? format(field.value, "HH:mm") : ""}
                                                    onChange={(e) => {
                                                        const [hours, minutes] = e.target.value.split(':');
                                                        const newDate = field.value ? new Date(field.value) : new Date();
                                                        newDate.setHours(parseInt(hours), parseInt(minutes));
                                                        field.onChange(newDate);
                                                    }}
                                                />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {image && (
                        <div className="relative w-full h-64">
                            <Image
                                layout='fill'
                                objectFit='contain'
                                src={URL.createObjectURL(image)}
                                alt="Pasted Image"
                                className="max-w-full max-h-64"
                            />
                        </div>
                    )}
                    {inputImage ?
                        <input onPaste={handlePaste} id='paste-image' className={`${image && 'hidden'} placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm`} placeholder="Paste image here" type="text" name="Paste Image" autoComplete='off' />
                        :
                        null
                    }
                    <div className='flex justify-end'>
                        <input
                            type='file'
                            id='input-image'
                            onChange={(event) => setImage(event.target.files[0])}
                            className={`${inputImage ? '' : 'invisible'} file:py-2 file:px-3 file:inline-flex file:items-center file:gap-x-2 file:text-sm file:font-semibold file:rounded-lg file:border file:border-transparent file:bg-blue-100 file:text-blue-800 file:hover:bg-blue-200 file:disabled:opacity-50 file:disabled:pointer-events-none file:dark:hover:bg-blue-900 file:dark:text-blue-400 file:dark:focus:outline-none file:dark:focus:ring-1 file:dark:focus:ring-gray-600`} />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setInputImage(!inputImage)
                            }}
                            className='py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
                            title='Add an image'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6 h-6'><path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path></svg>
                        </button>
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={() => setActiveView('details')} className="px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:bg-blue-800/30 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                            Cancel
                        </button>
                        {loadingCreateEvent ?
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                            :
                            <Button
                                type="submit"
                                variant='secondary'
                                disabled={!profile.farcasterId}>
                                {`${!profile.farcasterId ? 'Create a profile first!' : 'Submit'}`}
                            </Button>
                        }
                    </div>
                </form>
            </Form>
        </div>
    );
}