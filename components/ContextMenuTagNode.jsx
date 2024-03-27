import React from 'react'
import { ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

export default function ContextMenuTagNode({ node, style, tree }) {
    const { cardId, category, tags } = tree.props
    const ADD_TAG_TO_CARD = gql`
    mutation addTagToCard($input: UpdateIdealiteCardsInput!) {
        updateIdealiteCards(input: $input) {
          document {
            id
          }
        }
      }
    `
    const ADD_TAG_TO_ACCOUNT_RESOURCE = gql`
    mutation addTagToAccountResource($input: UpdateIdealiteAccountResourcesInput!) {
        updateIdealiteAccountResources(input: $input) {
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
        let arrTags = []
        if (tags?.length > 0) {
            tags.map((tag) => {
                const { tagId, name } = tag
                arrTags.push({ tagId: tagId, name: name })
            })
        }

        if (category === 'card') {
            addTagToCard({
                variables: {
                    input: {
                        id: cardId,
                        content: {
                            tags: [...arrTags, {
                                name: node.data.name,
                                tagId: node.data.id
                            }]
                        }
                    }
                }
            })
        }

        if (category === 'accountResource') {
            addTagToAccountResource({
                variables: {
                    input: {
                        id: cardId,
                        content: {
                            tags: [...arrTags, {
                                name: node.data.name,
                                tagId: node.data.id
                            }]
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

