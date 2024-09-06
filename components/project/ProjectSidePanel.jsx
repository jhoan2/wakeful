import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ProjectSidePanelEdit from './ProjectSidePanelEdit';
import ProjectSidePanelEvent from './ProjectSidePanelEvent';
import ProjectTagGroup from './ProjectTagGroup';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import ContextMenuTree from '../ContextMenuTree';
import { useProfileContext } from '../../context';
import { useRouter } from 'next/router';

export default function ProjectSidePanel({ projectData, category }) {
    const [openProjectSidePanel, setOpenProjectSidePanel] = useState(false)
    const [activeView, setActiveView] = useState('details')
    const router = useRouter();
    const { profile } = useProfileContext()
    const {
        createdAt,
        title,
        updatedAt,
        status,
        url,
        description,
        id: projectId,
        eventChildId,
        tags
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
                                    </DialogHeader>
                                    <div className="space-y-1">
                                        <Label htmlFor="url">Resource Url</Label>
                                        <Input id="url" defaultValue={`${url}`} disabled />
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        <RadioGroup
                                            defaultValue={status}
                                            className="flex flex-col space-y-1"
                                            disabled
                                        >
                                            <div className="flex items-center space-x-3 space-y-0 pointer-events-none">
                                                <RadioGroupItem value="DONE" id="s1" />
                                                <Label htmlFor="s1">Done</Label>
                                            </div>
                                            <div className="flex items-center space-x-3 space-y-0 pointer-events-none">
                                                <RadioGroupItem value="DOING" id="s2" />
                                                <Label htmlFor="s2">Doing</Label>
                                            </div>
                                            <div className="flex items-center space-x-3 space-y-0 pointer-events-none">
                                                <RadioGroupItem value="TODO" id="s3" />
                                                <Label htmlFor="s3">Todo</Label>
                                            </div>
                                            <div className="flex items-center space-x-3 space-y-0 pointer-events-none">
                                                <RadioGroupItem value="DROPPED" id="s4" />
                                                <Label htmlFor="s4">Dropped</Label>
                                            </div>
                                            <div className="flex items-center space-x-3 space-y-0 pointer-events-none">
                                                <RadioGroupItem value="ARCHIVED" id="s5" />
                                                <Label htmlFor="s5">Archived</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

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
                                </Dialog>
                                <div className='space-x-2'>
                                    <Button variant='secondary' onClick={() => setActiveView('edit')} className='text-blue-600'>Edit</Button>
                                    {eventChildId ? (
                                        <Button variant='secondary' onClick={() => router.push(`/events/${eventChildId}`)} className='text-blue-600'>Go to Event</Button>
                                    ) : (
                                        <Button variant='secondary' onClick={() => setActiveView('event')} className='text-blue-600'>Create Event</Button>
                                    )}
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
                            <ProjectSidePanelEdit
                                title={title}
                                description={description}
                                url={url}
                                status={status}
                                createdAt={createdAt}
                                updatedAt={updatedAt}
                                projectId={projectId}
                                setActiveView={setActiveView}
                                setOpenProjectSidePanel={setOpenProjectSidePanel}
                            />
                        )
                    }
                    {
                        activeView === 'event' && (
                            <ProjectSidePanelEvent
                                title={title}
                                description={description}
                                url={url}
                                projectId={projectId}
                                setActiveView={setActiveView}
                                tags={tags}
                                category={category}
                            />
                        )
                    }
                </div>
            </div>
        </div >
    )
}
