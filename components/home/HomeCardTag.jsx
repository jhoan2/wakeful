import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

export default function HomeCardTag({ accountResourceId, tag, tags, }) {
    const [isHovered, setIsHovered] = useState(false);
    const { tagId: tagIdToDelete } = tag

    const DELETE_TAG_FROM_ACCOUNT_RESOURCE = gql`
    mutation deleteTagFromAccountResource($input: UpdateIdealiteAccountResourcesv1Input!) {
        updateIdealiteAccountResourcesv1(input: $input) {
          document {
            id
          }
        }
      }
    `

    const [deleteTagFromAccountResource] = useMutation(DELETE_TAG_FROM_ACCOUNT_RESOURCE, {
        refetchQueries: ['GetCardsPerUrlPerUser'],
        onError: (error) => {
            toast.error('Something went wrong with deleting tag.')
            console.log(error.message)
        }
    });


    const sendDeleteTag = (event) => {
        event.preventDefault();
        let arrTags = []
        if (tags?.length > 0) {
            tags.map((tag) => {
                const { tagId, name } = tag
                if (tagId !== tagIdToDelete) {
                    arrTags.push({ tagId: tagId, name: name })
                }
            })
        }

        deleteTagFromAccountResource({
            variables: {
                input: {
                    id: accountResourceId,
                    content: {
                        tags: [...arrTags]
                    }
                }
            }
        })
    }

    return (
        <Button
            variant='secondary'
            size='small'
            className='pr-2 pl-2 bg-amber-200 hover:bg-red-200'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(event) => sendDeleteTag(event)}
        >
            {tag.name}
            {isHovered && (
                <span className='pl-2'>X</span>
            )}
        </Button>
    )
}