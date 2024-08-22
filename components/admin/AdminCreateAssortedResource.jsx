import React from 'react'
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

export default function AdminCreateAssortedResource({ clientMutationId }) {

    const createAssortedResource = async () => {

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/createNewResource`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author: 'idealite',
                    clientMutationId: clientMutationId,
                    description: 'Notes with no specific resource go here.',
                    publishedAt: new Date().toISOString(),
                    title: 'Assorted Resources',
                    url: 'n/a',
                    createAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deleted: false
                }),
            })

            if (!res.ok) {
                throw new Error('Server responded with an error: ' + res.status);
            } else {
                const response = await res.json()
                console.log(response)
                toast.success('Created Assorted Resources Folder')
            }

        } catch (error) {
            toast.error(`${error.message}`)
            console.log(error.message)
        }
    }

    return (
        <div>
            <Button onClick={() => createAssortedResource()}>Create assorted resource</Button>
        </div>
    )
}
