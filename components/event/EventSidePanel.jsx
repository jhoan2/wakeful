import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useProfileContext } from '../../context';
import { useRouter } from 'next/router';
import EventSidePanelEdit from './EventSidePanelEdit';
import { useCeramicContext } from '../../context';
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import EventTagGroup from './EventTagGroup'

export default function EventSidePanel({ data }) {
    const [openProjectSidePanel, setOpenProjectSidePanel] = useState(false)
    const [activeView, setActiveView] = useState('details')
    const router = useRouter();
    const { profile } = useProfileContext()
    const clients = useCeramicContext()
    const { composeClient } = clients;
    const {
        title,
        description,
        startTimestamp,
        endTimestamp,
        hostDisplayName,
        clientMutationId,
        hostFarcasterId,
        hostAvatarCid,
        url,
        projectParentId,
        tags,
        createdAt,
        updatedAt,
        isPulic,
        deleted,
        id: eventId
    } = data;

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
                <div className='p-4'>
                    {
                        activeView === 'details' && (
                            <div className='space-y-6'>
                                <Dialog>
                                    <DialogHeader>
                                        <DialogTitle>{title}</DialogTitle>
                                        <DialogDescription>{description}</DialogDescription>
                                        {deleted && (
                                            <Badge variant="destructive" className="w-fit">
                                                Deleted
                                            </Badge>
                                        )}
                                    </DialogHeader>
                                    <div className="space-y-1">
                                        <Label htmlFor="url">Resource Url</Label>
                                        <Input id="url" defaultValue={`${url}`} disabled />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="tags">Tags:</Label>
                                        <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]" title="Tags for side quest">
                                            <EventTagGroup tags={tags.edges} page={'panel'} />
                                        </div>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className="flex flex-col mb-4 w-[220px] text-left font-normal">
                                            <Label htmlFor="startTime" className='mb-4'>Start Time</Label>
                                            <div className="flex w-[220px] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 text-left font-normal gap-2 p-2 border rounded-md min-h-[40px]" title="Start Time for event">
                                                {startTimestamp ? (
                                                    format(startTimestamp, "PPP p")
                                                ) : (
                                                    <span>Pick a date and time</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col mb-4 w-[220px] pl-3 text-left font-normal">
                                            <Label htmlFor="endTime" className='mb-4'>End Time</Label>
                                            <div className="flex w-[220px] inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 text-left font-normal gap-2 p-2 border rounded-md min-h-[40px]" title="End Time for event">
                                                {endTimestamp ? (
                                                    format(endTimestamp, "PPP p")
                                                ) : (
                                                    <span>Pick a date and time</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog>
                                <div className='space-x-2'>
                                    {
                                        (clientMutationId === composeClient.id) && (
                                            <div className='space-x-2'>
                                                <Button variant='secondary' onClick={() => setActiveView('edit')} className='text-blue-600'>Edit</Button>
                                                <Button
                                                    variant='secondary'
                                                    disabled={!projectParentId}
                                                    onClick={() => router.push(`/projects/${projectParentId}`)}
                                                    className='text-blue-600'>
                                                    Go Back to Project
                                                </Button>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='flex justify-between text-sm fixed bottom-0 left-0 right-0'>
                                    <p>Created At: {localeCreatedAt}</p>
                                    <p>Last Updated: {localeUpdatedAt}</p>
                                </div>
                            </div>
                        )

                    }
                    {
                        activeView === 'edit' && (
                            <EventSidePanelEdit
                                title={title}
                                description={description}
                                startTimestamp={startTimestamp}
                                endTimestamp={endTimestamp}
                                url={url}
                                eventId={eventId}
                                tags={tags.edges}
                                projectParentId={projectParentId}
                                setActiveView={setActiveView}
                                setOpenProjectSidePanel={setOpenProjectSidePanel}
                            />
                        )
                    }
                </div>
            </div>
        </div >
    )
}
