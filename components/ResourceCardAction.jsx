import React from 'react'
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash, FileSymlink } from 'lucide-react';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { gql, useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';

export default function ResourceCardAction({ cardId }) {
    const GET_USERS_PROJECT_LIST = gql`
    query getUsersProjectList {
        viewer {
          idealiteProjectList(
            filters: {where: {deleted: {equalTo: false}, status: {in: [TODO, DOING]}}},
            first: 15,
            sorting: {priority: ASC},
          ) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    `

    const { loading, error, data } = useQuery(GET_USERS_PROJECT_LIST);

    const UPDATE_NOTE = gql`
    mutation UPDATE_NOTE($input: UpdateIdealiteCardsInput!) {
        updateIdealiteCards(input: $input) {
          document {
            id
            annotation
          }
        }
      }`


    const [sendDeleteNote, { error: deleteError }] = useMutation(UPDATE_NOTE, {
        refetchQueries: ['getCardsForResource'],
    });

    const deleteNote = async () => {
        await sendDeleteNote({
            variables: {
                input: {
                    id: cardId,
                    content: {
                        updatedAt: new Date().toISOString(),
                        deleted: true,
                    }
                }
            }
        })
    }

    const CREATE_COLLECTION = gql`
    mutation createCollection($input: CreateIdealiteProjectCardCollectionInput!) {
        createIdealiteProjectCardCollection(input: $input) {
          document {
            id
          }
        }
      }
    `

    const [sendCreateCollection, { error: createCollectionError }] = useMutation(CREATE_COLLECTION);

    const createCollection = async (projectId) => {
        await sendCreateCollection({
            variables: {
                input: {
                    content: {
                        idealiteCardId: cardId,
                        projectId: projectId,
                        deleted: false,
                    }
                }
            }
        })
    }


    if (deleteError) {
        toast.error('Error deleting note')
        console.log(deleteError)
    }

    if (createCollectionError) {
        toast.error('Error sending note to project')
        console.log(createCollectionError)
    }

    return (
        <div className='absolute top-2 right-2'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className='p-0' ><MoreVertical className='h-4 w-4' /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteNote()} className='text-red-600 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-red-100 focus:text-red-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='flex items-center'>
                            <FileSymlink className="mr-2 h-4 w-4" />
                            <span>Send to Project</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className='w-56 max-w-56 overflow-auto max-h-96 '>
                            {
                                data && data?.viewer?.idealiteProjectList?.edges?.length === 0 ?
                                    <DropdownMenuItem className='flex items-center relative flex cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
                                        <span>No projects available</span>
                                    </DropdownMenuItem>
                                    :
                                    null
                            }
                            {data?.viewer?.idealiteProjectList?.edges?.map((project) => {
                                return (
                                    <DropdownMenuItem key={project?.node?.id} onClick={() => createCollection(project.node.id)} className='flex items-center relative flex cursor-default truncate select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
                                        <span>{project?.node?.title}</span>
                                    </DropdownMenuItem>
                                )
                            })}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
