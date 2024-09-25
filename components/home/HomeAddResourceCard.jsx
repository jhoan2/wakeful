import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useCeramicContext } from '../../context';
import { toast } from 'sonner';
import { gql, useMutation } from '@apollo/client';

export default function HomeAddResourceCard({ setShowAddResourceModal, cid, title, description, url, resourceId }) {
    const [loadingAddResource, setLoadingAddResource] = useState(false)
    const clients = useCeramicContext()
    const { composeClient } = clients
    const clientMutationId = composeClient.id

    const CREATE_ACCOUNT_RESOURCE = gql`
    mutation createAccountResource($input: CreateIdealiteAccountResourcesv1Input!) {
        createIdealiteAccountResourcesv1(input: $input) {
          document {
            id
          }
        }
      }
      `

    const [createAccountResource] = useMutation(CREATE_ACCOUNT_RESOURCE, {
        onError: (error) => console.log('Error creating account resource: ' + error.message),
        refetchQueries: ['GetCardsPerUrlPerUser'],
        onCompleted: (() => {
            toast.success('Successfully added book.')
            setTimeout(function () {
                setLoadingAddResource(false)
                setShowAddResourceModal(false)
            }, 1000);
        })
    });

    const sendCreateAccountResource = async () => {
        try {
            setLoadingAddResource(true)
            await createAccountResource({
                variables: {
                    input: {
                        "content": {
                            recipient: clientMutationId,
                            resourceId: resourceId,
                            url: url,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            readingStatus: 'READING'
                        }
                    }
                }
            })
            return
        } catch (error) {
            toast.error(`${error.message}`)
            console.log(error.message)
        }
    }

    return (
        <div>
            {loadingAddResource ?
                <p>Submitting...</p>
                :
                <Card className='hover:shadow-lg' onClick={() => sendCreateAccountResource()}>
                    <CardHeader>
                        {
                            cid ?
                                <img className="aspect-square object-cover rounded-t-lg "
                                    src={`${cid}?img-width=384`}
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; //prevent looping
                                        currentTarget.src = '/home-card-gradient.png'
                                    }}
                                    crossOrigin='anonymous'
                                    alt="Image Description" />
                                :
                                null
                        }
                    </CardHeader>
                    <CardContent>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardContent>
                </Card>
            }
        </div>

    )
}
