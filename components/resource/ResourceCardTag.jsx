import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

export default function ResourceCardTag({ tag }) {
    const [isHovered, setIsHovered] = useState(false);

    const DELETE_TAG_FROM_CARD = gql`
    mutation deleteTagFromCard($input: UpdateIdealiteTagCardCollectionv1Input = {id: "", content: {}}) {
        updateIdealiteTagCardCollectionv1(input: $input) {
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
        deleteTagFromCard({
            variables: {
                input: {
                    id: tag.node.id,
                    content: {
                        deleted: true
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
            {tag.node.idealiteTag.name}
            {isHovered && (
                <span className='pl-2'>X</span>
            )}
        </Button>
    )
}
