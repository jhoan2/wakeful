import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useMutation, gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProfileContext } from '../../context';

export default function ProjectActions({ projectId, projectTitle }) {
    const { profile } = useProfileContext();
    const DELETE_PROJECT = gql`mutation DeleteProject($input: UpdateIdealiteProjectv1Input!) {
        updateIdealiteProjectv1(input: $input) {
          document {
                id
            }
        }
    }`

    const [sendDeleteProject] = useMutation(DELETE_PROJECT, {
        refetchQueries: ['getUsersProjects'],
    });

    const deleteProject = async () => {
        await sendDeleteProject({
            variables: {
                input: {
                    id: projectId,
                    content: {
                        updatedAt: new Date().toISOString(),
                        deleted: true,
                    }
                }
            }
        })
    }

    const FAVORITE_PROJECT = gql`
        mutation favoritePoject($input: UpdateIdealiteProfilev1Input!) {
            updateIdealiteProfilev1 (
                input: $input
                ) {
                document {
                    id
                }
            }
        }
    `

    const addFavorite = async () => {
        await sendAddFavorite({
            variables: {
                input: {
                    id: profile.id,
                    content: {
                        favorites: {
                            id: projectId,
                            title: projectTitle
                        }
                    }
                }
            }
        })
    }

    const [sendAddFavorite, { error: errorAddFavorite }] = useMutation(FAVORITE_PROJECT, {
        onCompleted: () => toast.success('Added to Favorites'),
    });

    if (errorAddFavorite) {
        toast.error('Error adding to favorites')
        console.log(errorAddFavorite.message)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => deleteProject()}
                >
                    Delete Project
                </DropdownMenuItem>
                {profile.id ?
                    <DropdownMenuItem
                        onClick={() => addFavorite()}
                    >
                        Favorite
                    </DropdownMenuItem>
                    :
                    null
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
