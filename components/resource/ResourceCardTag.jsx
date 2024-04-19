import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { gql, useMutation } from '@apollo/client';

export default function ResourceCardTag({ tag, tags, cardId }) {
    const [isHovered, setIsHovered] = useState(false);
    const { tagId: tagIdToDelete } = tag

    const DELETE_TAG_FROM_CARD = gql`
    mutation addTagToCard($input: UpdateIdealiteCardsInput!) {
        updateIdealiteCards(input: $input) {
          document {
            id
          }
        }
      }
    `

    const [deleteTagFromCard] = useMutation(DELETE_TAG_FROM_CARD, {
        refetchQueries: ['getCardsForResource'],
        onError: (error) => {
            toast.error('Something went wrong with deleting tag.')
            console.log(error.message)
        }
    });

    const sendDeleteTag = () => {
        let arrTags = []
        if (tags?.length > 0) {
            tags.map((tag) => {
                const { tagId, name } = tag
                if (tagId !== tagIdToDelete) {
                    arrTags.push({ tagId: tagId, name: name })
                }
            })
        }

        deleteTagFromCard({
            variables: {
                input: {
                    id: cardId,
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
            onClick={() => sendDeleteTag()}
        >
            {tag.name}
            {isHovered && (
                <span className='pl-2'>X</span>
            )}
        </Button>
    )
}
