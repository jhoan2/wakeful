import React, { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useCeramicContext } from '../../context'
import { gql, useMutation } from '@apollo/client';

export default function HomeCreateOpenGraph({ url, setShowAddResourceModal }) {
    const clients = useCeramicContext()
    const { composeClient } = clients
    const [loadingSubmitAddResource, setLoadingSubmitAddResource] = useState(false)
    const [loadingOgData, setLoadingOgData] = useState(false)
    const [ogData, setOgData] = useState(null)

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


    const getOpenGraphData = async (url) => {
        setLoadingOgData(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/getOpenGraphData?url=${url}`, {
                method: 'GET',
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setOgData(data.result)
            setLoadingOgData(false)
            return
        } catch (error) {
            toast.error(error.message)
            console.log(error.message);
            setLoadingOgData(false)

        }
    }

    const createNewResource = async () => {
        setLoadingSubmitAddResource(true)
        const ogDataImage = ogData?.ogImage ? ogData?.ogImage[0]?.url : null
        const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/createNewResource`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientMutationId: composeClient.id,
                url: url,
                title: ogData?.ogTitle,
                description: ogData?.ogDescription,
                author: ogData?.author,
                cid: ogDataImage,
                mediaType: ogData?.ogType,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }),
        })

        if (!res.ok) {
            throw new Error('Server responded with an error: ' + res.status);
        }
        const data = await res.json();

        try {
            await createAccountResource({
                variables: {
                    input: {
                        "content": {
                            recipient: composeClient.id,
                            resourceId: data?.newResourceId,
                            url: url,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            readingStatus: 'READING'
                        }
                    }
                }
            })
            setLoadingSubmitAddResource(false)
            setShowAddResourceModal(false)
            return data.newResourceId
        } catch (error) {
            setLoadingSubmitAddResource(false)
            toast.error(error.message)
            console.log(error.message)
            setShowAddResourceModal(false)
        }
    }

    useEffect(() => {
        if (url) {
            getOpenGraphData(url)
        }
    }, [url])

    return (
        <div className='pt-4'>
            {
                loadingOgData ?
                    <p className='flex justify-center'>Gathering url details...</p>
                    :
                    (ogData &&
                        <div>
                            <Card>
                                <CardHeader>
                                    {
                                        (ogData.ogImage?.length > 0) ?
                                            <img
                                                alt="OG Image"
                                                className="w-full h-[200px] object-cover rounded-t-lg"
                                                height="200"
                                                src={`${ogData.ogImage[0].url}`}
                                                style={{
                                                    aspectRatio: "400/200",
                                                    objectFit: "cover",
                                                }}
                                                width="400"
                                            />
                                            :
                                            null
                                    }
                                </CardHeader>
                                <CardContent>
                                    <CardTitle>{ogData.ogTitle}</CardTitle>
                                    <CardDescription>{ogData.ogDescription}</CardDescription>
                                    <div className='flex justify-between items-center'>
                                        <CardDescription>Author: {ogData.author}</CardDescription>
                                        <CardDescription>Type: {ogData.ogType}</CardDescription>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className='flex justify-end w-full pt-4'>
                                {
                                    loadingSubmitAddResource ?
                                        <Button disabled={loadingSubmitAddResource} className='w-full'>Submitting...</Button>
                                        :
                                        <Button onClick={() => createNewResource()} className='w-full' >Submit</Button>
                                }
                            </div>
                        </div>)
            }
        </div>
    )
}
