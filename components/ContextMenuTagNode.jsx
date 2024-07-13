import React from 'react'
import { ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

export default function ContextMenuTagNode({ node, style, tree }) {
    const clients = useCeramicContext()
    const { cardId, category } = tree.props
    const ADD_TAG_TO_CARD = gql`
    mutation MyMutation($input: CreateIdealiteTagCardCollectionv1Input!) {
        createIdealiteTagCardCollectionv1(input: $input) {
            document {
                id
            }
        }
    }
    `
    const ADD_TAG_TO_ACCOUNT_RESOURCE = gql`
    mutation addTagToAccountResource($input: CreateIdealiteTagAccountResourceCollectionv1Input!) {
        createIdealiteTagAccountResourceCollectionv1(input: $input) {
            document {
                id
            }
        }
    }
    `

    const [addTagToCard] = useMutation(ADD_TAG_TO_CARD, {
        refetchQueries: ['getCardsForResource'],
        onError: (error) => {
            toast.error('Something went wrong with tagging.')
            console.log(error.message)
        }
    });

    const [addTagToAccountResource] = useMutation(ADD_TAG_TO_ACCOUNT_RESOURCE, {
        refetchQueries: ['GetCardsPerUrlPerUser'],
        onError: (error) => {
            toast.error('Something went wrong with tagging.')
            console.log(error.message)
        }
    });

    const sendAddTag = () => {

        if (category === 'card') {
            addTagToCard({
                variables: {
                    input: {
                        content: {
                            deleted: false,
                            idealiteCardId: cardId,
                            idealiteTagId: node.data.id
                        }
                    }
                }
            })
        }

        if (category === 'accountResource') {
            addTagToAccountResource({
                variables: {
                    input: {
                        content: {
                            deleted: false,
                            idealiteAccountResourceId: cardId,
                            idealiteTagId: node.data.id
                        }
                    }
                }
            })
        }

    }

    return (
        <div
            style={style}
            className={`flex items-center ${node.isInternal && 'cursor-pointer'} hover:bg-slate-400`}

        >
            <span onClick={() => node.isInternal && node.toggle()}>
                {node.isInternal ? (
                    node.isOpen ? (
                        <ChevronDown />
                    ) : (
                        <ChevronRight />
                    )
                ) : null}
            </span>
            <Tag className='h-3' />
            <span onClick={() => sendAddTag()}>
                {node.data.name}
            </span>
        </div>
    )
}

