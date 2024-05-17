import React from 'react'
import { useCeramicContext } from '../../context';
import { toast } from 'sonner';
import { gql, useMutation, useLazyQuery } from '@apollo/client';

export default function HomeCreateGooglePlayCard({
    author,
    title,
    coverUrl,
    coverUrlForCard,
    published,
    openLibraryKey,
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

    const QUERY_FOR_OPEN_LIBRARY_KEY = gql`
    query queryForOpenLibraryKey($url: String = "") {
        idealiteResourcev2Index(
          first: 10
          filters: {where: {openLibraryKey: {equalTo: $url}}}
        ) {
          edges {
            node {
              id
            }
          }
        }
      }
      `

    const [searchForBookResource] = useLazyQuery(QUERY_FOR_OPEN_LIBRARY_KEY, {
        onError: (error) => console.log('Error searching for book resource: ' + error.message),
        variables: { url: openLibraryKey }
    });


    const createNewBookResource = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/createNewBookResource`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author: author,
                    cid: coverUrl,
                    clientMutationId: clientMutationId,
                    description: firstSentence,
                    openLibraryKey: openLibraryKey,
                    publishedAt: published,
                    title: title,
                    url: googlePlayUrl,
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
                    setShowAddResourceModal(false)
                }, 1000);
            }
            return
        } catch (error) {
            toast.error(`${error.message}`)
            console.log(error.message)
        }
    }

    const handleClick = async () => {
        try {
            setLoadingCreateGooglePlay(true)
            const result = await searchForBookResource()
            const { data } = result
            if (data?.idealiteResourcev2Index?.edges.length > 0) {
                const createAccountResourceData = await createAccountResource({
                    variables: {
                        input: {
                            "content": {
                                recipient: clientMutationId,
                                resourceId: data.idealiteResourcev2Index.edges[0].node.id,
                                url: googlePlayUrl,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                                readingStatus: 'READING'
                            }
                        }
                    }
                })
                if (createAccountResourceData.data.createIdealiteAccountResources.document.id) {
                    toast.success('Successfully added book.')
                    setTimeout(function () {
                        setShowAddResourceModal(false)
                    }, 1000);
                }
            } else {
                createNewBookResource()
            }
            setLoadingCreateGooglePlay(false)
        } catch (error) {
            toast.error(`${error.message}`)
            console.log(error.message)
            setLoadingCreateGooglePlay(false)
            return
        }
    }

    return (
        <div
            className='flex justify-center space-x-2 p-2 rounded-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-400'
            onClick={() => handleClick()}
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
