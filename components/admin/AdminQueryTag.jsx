import React, { useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';

export default function AdminQueryTag({ setTagTreeData, tagTreeData }) {
    const [useFirst, setUseFirst] = useState(false)
    const [queryLength, setQueryLength] = useState(50)
    const [deletedFilter, setDeletedFilter] = useState(false)
    const [tagNameFilter, setTagNameFilter] = useState('')
    const [date, setDate] = useState(null)

    const QUERY_IDEALITE_TAG = gql`
        query queryIdealiteTagv1 ($last: Int!, $filters: IdealiteTagv1FiltersInput! ){
            idealiteTagv1Index(
                last: $last, 
                filters: $filters
                ) {
                edges {
                    node {
                        deleted
                        id
                        createdAt
                        name
                        parent
                        children {
                            name
                            tagId
                        }
                        value
                        updatedAt
                        tagTree
                    }
                }
            }
        }
    `
    const createFilters = () => {
        let filters = {
            where: {
                deleted: { equalTo: deletedFilter },
            }
        }

        if (tagNameFilter) {
            filters.where.name = { equalTo: tagNameFilter }
        }

        if (date) {
            filters.where.createdAt = { greaterThan: new Date(date).toISOString() }
        }

        return filters
    }

    const paginationArg = useFirst ? { first: queryLength } : { last: queryLength }
    const [sendAdminQuery, { loading: loadingQueryTags, error: errorQueryTags, data: adminTagsData }] = useLazyQuery(QUERY_IDEALITE_TAG, {
        onCompleted: () => resetFilters()
    });

    const resetFilters = () => {
        setTagNameFilter('')
        setDate(null)
    }

    const sendNodesToTagTree = () => {
        let arr = []
        adminTagsData.idealiteTagv1Index.edges.map((node) => {
            const { id, name, value } = node.node
            arr.push({ id: id, name: name, children: new Array(), value: value })
        })
        setTagTreeData(...tagTreeData, arr)
    }

    if (loadingQueryTags) return <p>Loading ...</p>;
    if (errorQueryTags) console.log(`Error! ${errorQueryTags.message}`);

    return (
        <div>
            <Button variant='secondary' title='You can get the results from left column once you send it.' onClick={() => sendAdminQuery({ variables: { filters: createFilters(), ...paginationArg } })}>Query</Button>
            <Button variant='secondary' onClick={() => setDeletedFilter(!deletedFilter)}>
                {
                    deletedFilter ?
                        <p>deleted: true</p>
                        :
                        <p>deleted: false</p>
                }
            </Button>
            <Button variant='secondary' onClick={() => sendNodesToTagTree()} title='Sends the results from query to left column'>Send to Tag Tree</Button>
            <div>
                <Label>First</Label>
                <input
                    type="number"
                    className='w-full border-2 border-amber-200'
                    placeholder="first"
                    onChange={(e) => setQueryLength(+e.currentTarget.value)}
                    autoComplete='off'
                />
                <Button variant='secondary' onClick={() => setUseFirst(!useFirst)}>
                    {
                        useFirst ?
                            <p>Using first</p>
                            :
                            <p>Using Last</p>
                    }
                </Button>


            </div>
            <div>
                <Label>Tag Name</Label>
                <input
                    type="text"
                    className='w-full border-2 border-amber-200'
                    placeholder="tag name"
                    onChange={(e) => setTagNameFilter(e.currentTarget.value)}
                />
            </div>
            <div>
                Date: {date && <p>You picked {format(date, 'PP')}.</p>}

                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(e) => setDate(e)}
                    className="rounded-md border"
                />
                <Button variant='secondary' onClick={() => setDate(null)}>Reset Date</Button>
            </div>
        </div>
    )
}
