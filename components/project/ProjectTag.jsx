import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

export default function ProjectTag({ name, projectTitleTagId, category, projectTagId }) {
    const [isHovered, setIsHovered] = useState(false);

    const DELETE_TAG_FROM_PROJECT = gql`
        mutation deleteTagFromProject($input: UpdateIdealiteTagProjectCollectionv1Input = {id: "", content: {}}) {
            updateIdealiteTagProjectCollectionv1(input: $input) {
                document {
                    id
                }
            }
        }
    `

    const [deleteTagFromProject] = useMutation(DELETE_TAG_FROM_PROJECT, {
        refetchQueries: ['getUsersProjectCardCollection'],
        onError: (error) => {
            toast.error('Something went wrong with deleting tag at ProjectTag.')
            console.log(error.message)
        }
    });

    const [deleteTagFromProjectTitle] = useMutation(DELETE_TAG_FROM_PROJECT, {
        refetchQueries: ['getProjectTitle'],
        onError: (error) => {
            toast.error('Something went wrong with deleting tag from project title.')
            console.log(error.message)
        }
    });

    const sendDeleteTag = () => {
        if (category === 'project') {
            deleteTagFromProject({
                variables: {
                    input: {
                        id: projectTagId,
                        content: {
                            deleted: true
                        }
                    }
                }
            })
        }

        if (category === 'projectTitle') {
            deleteTagFromProjectTitle({
                variables: {
                    input: {
                        id: projectTitleTagId,
                        content: {
                            deleted: true
                        }
                    }
                }
            })
        }
    }

    return (
        <Button
            variant='secondary'
            size='small'
            className='pr-2 pl-2 bg-amber-200 hover:bg-red-200'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => sendDeleteTag()}
        >
            {name}
            {isHovered && (
                <span className='pl-2'>X</span>
            )}
        </Button>
    )
}