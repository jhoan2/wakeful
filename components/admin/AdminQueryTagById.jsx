import React, { useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';

export default function AdminQueryTagById() {
    const [queryTagId, setQueryTagId] = useState('')

    const QUERY_IDEALITE_TAG_BY_ID = gql`
        query queryIdealiteTagv1ById {
            node(id: "${queryTagId}") {
            ... on IdealiteTagv1 {
                id
                name
                value
                updatedAt
                tagTree
                parent
                createdAt
                deleted
                children {
                name
                tagId
                }
            }
            }
        }
    `


    const [sendQueryTagById, { error: errorQueryTagById, data: adminTagByIdData }] = useLazyQuery(QUERY_IDEALITE_TAG_BY_ID);

    if (errorQueryTagById) console.log('Error: ' + errorQueryTagById.message)
    if (adminTagByIdData) console.log(adminTagByIdData)
    return (
        <div>
            <Button variant='secondary' onClick={() => sendQueryTagById({ variables: { id: queryTagId } })}>Query</Button>
            <Label>Tag ID</Label>
            <p className='w-10 '>{queryTagId}</p>
            <Input
                type="text"
                className='w-full border-2 border-amber-200'
                placeholder="tag id"
                onChange={(e) => setQueryTagId(e.currentTarget.value)}
                autoComplete='off'
            />
        </div>
    )
}
