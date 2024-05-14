import React from 'react'
import { useCeramicContext } from '../../context';
import { toast } from 'sonner';
import { gql, useMutation } from '@apollo/client';

export default function HomeCreateGooglePlayCard({
    author,
    title,
    coverUrl,
    coverUrlForCard,
    published,
    firstSentence,
    googlePlayUrl,
    setShowAddResourceModal,
    setLoadingCreateGooglePlay
}) {
    const clients = useCeramicContext()
    const { composeClient } = clients
    const clientMutationId = composeClient.id

    const CREATE_ACCOUNT_RESOURCE = gql`
    mutation createAccountResource($input: CreateIdealiteAccountResourcesInput!) {
        createIdealiteAccountResources(input: $input) {
          document {
            id
          }
        }
      }
      `

    const [createAccountResource] = useMutation(CREATE_ACCOUNT_RESOURCE, {
        onError: (error) => console.log('Error creating account resource: ' + error.message),
        refetchQueries: ['GetCardsPerUrlPerUser']
    });

    const createNewBookResource = async () => {
        try {
            setLoadingCreateGooglePlay(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/createNewBookResource`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    clientMutationId: clientMutationId,
                    author: author,
                    url: googlePlayUrl,
                    description: firstSentence,
                    publishedAt: published,
                    cid: coverUrl,
                }),
            })

            if (!res.ok) {
                throw new Error('Server responded with an error: ' + res.status);
            }

            const data = await res.json();

            console.log(data)

            await createAccountResource({
                variables: {
                    input: {
                        "content": {
                            recipient: clientMutationId,
                            resourceId: data.newResourceId,
                            url: googlePlayUrl,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            readingStatus: 'READING'
                        }
                    }
                }
            })

            if (data.newResourceId) {
                toast.success('Successfully added book.')
                setTimeout(function () {
                    setLoadingCreateGooglePlay(false)
                    setShowAddResourceModal(false)
                }, 1000);
            }
            return
        } catch (error) {
            toast.error(`${error.message}`)
            console.log(error.message)
        }
    }

    return (
        <div
            className='flex justify-center space-x-2 p-2 rounded-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-400'
            onClick={() => createNewBookResource()}
        >
            <img src={coverUrlForCard} alt={title} />
            <div className='flex flex-col'>
                <p className='text-xl font-semibold leading-none tracking-tight'>
                    {title}
                </p>
                <p className='text-sm text-slate-500'>
                    {author}
                </p>
                <p className='text-sm text-slate-500'>
                    Published: {published}
                </p>
            </div>
        </div>
    )
}
