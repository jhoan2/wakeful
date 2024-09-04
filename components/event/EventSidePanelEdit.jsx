import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from 'lucide-react';
import { useProfileContext } from '../../context';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/router';
import { useCeramicContext } from '../../context';
import { useApolloClient } from '@apollo/client';


export default function EventSidePanelEdit({
    title,
    description,
    startTimestamp,
    endTimestamp,
    url,
    eventId,
    tags,
    projectParentId,
    setActiveView
}) {
    const [loadingCreateEvent, setLoadingCreateEvent] = useState(false)
    const router = useRouter()
    const clients = useCeramicContext()
    const { composeClient } = clients
    const apolloClient = useApolloClient();
    const formSchema = z.object({
        title: z.string().min(2).max(140),
        description: z.string(),
        startTimestamp: z.date(),
        endTimestamp: z.date(),
        url: z.string().optional(),
        tags: z.array(z.object({
            node: z.object({
                idealiteTag: z.object({
                    id: z.string(),
                    name: z.string(),
                    deleted: z.boolean().optional(),
                })
            })
        })).optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title || "",
            description: description || '',
            startTimestamp: startTimestamp ? new Date(startTimestamp) : undefined,
            endTimestamp: endTimestamp ? new Date(endTimestamp) : undefined,
            url: url || "",
            tags: tags || [],
        },
    });

    const submitEvent = async (values) => {
        setLoadingCreateEvent(true);

        let projectContent = {
            clientMutationId: composeClient.id,
            url: values.url,
            title: values.title,
            description: values.description,
            projectId: eventId,
            startTimestamp: values.startTimestamp.toISOString(),
            endTimestamp: values.endTimestamp.toISOString(),
        }

        try {
            const response = await fetch('/api/events', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectContent: projectContent
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update event');
            }

            await apolloClient.refetchQueries({
                include: ['GetEventDetails'],
            });

            setActiveView('details');
        } catch (error) {
            console.error('Error creating event:', error);
        } finally {
            setLoadingCreateEvent(false);
        }
    }

    const deleteEvent = async (eventId) => {
        try {
            const response = await fetch('/api/events', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId: eventId
                }),
            });

            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Failed to delete event error: ${error.message}`);
            }

            const data = await response.json();

        } catch (error) {
            console.error('Error deleting event:', error);
        } finally {
            setActiveView('details')
            router.push(`/projects/${projectParentId}`)
        }
    }

    return (
        <div className='space-y-4'>
            <div className='flex justify-end'>
                <Button variant='destructive' onClick={() => deleteEvent(eventId)}>Delete Event</Button>
            </div>
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
                                    <Input placeholder="Resource URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags:</FormLabel>
                                <FormControl>
                                    <div className='flex w-full'>
                                        <div className="flex flex-wrap w-full gap-2 p-2 border rounded-md min-h-[40px]" title="Event Tags">
                                            {field.value.map((tag, index) => (
                                                <Button
                                                    key={tag.node.idealiteTag.id}
                                                    variant="secondary"
                                                    size='small'
                                                    type='button'
                                                    className={`pr-2 pl-2 bg-amber-200 cursor-default hover:bg-amber-200`}
                                                >
                                                    {tag.node.idealiteTag.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                            >
                                Submit
                            </Button>
                        }
                    </div>
                </form>
            </Form>
        </div >
    );
}