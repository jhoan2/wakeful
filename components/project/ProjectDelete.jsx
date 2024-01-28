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

export default function ProjectDelete({ projectId }) {
    const DELETE_PROJECT = gql`mutation DeleteProject($input: UpdateIdealiteProjectInput!) {
        updateIdealiteProject(input: $input) {
          document {
                id
            }
        }
    }`

    const [sendDeleteProject, { data, loading, error }] = useMutation(DELETE_PROJECT, {
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
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
