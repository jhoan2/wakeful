import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { Tree } from "react-arborist";
import AdminEditTagNode from './AdminEditTagNode';
import { ArrowBigUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

export default function AdminEditTagTree({ tagTreeData, setTagTreeData, setTagPackData }) {
    const [adminSearchTerm, setAdminSearchTerm] = useState('')
    const [rootId, setRootId] = useState('')
    const [refreshTagTree, setRefreshTagTree] = useState(false)
    const treeRef = useRef(null)

    const SUBMIT_TAG_TREE = gql`
        mutation submitTagTree($input: UpdateIdealiteTagv1Input!) {
            updateIdealiteTagv1(input: $input) {
            document {
                id
            }
            }
        }
    `
    const [sendSubmitTagTree, { data: submitTagTreeData, error: submitTagTreeError }] = useMutation(SUBMIT_TAG_TREE);

    const handleBasicData = () => {
        setTagTreeData([...tagTreeData,
        {
            id: '1', name: 'root', children: []
        }
        ])
    }

    const submitTagTree = () => {
        const jsonTagTreeData = JSON.stringify(tagTreeData)
        let tagContent = {
            updatedAt: new Date().toISOString(),
            tagTree: jsonTagTreeData
        }

        if (!rootId) {
            toast.error('Missing root Id')
            return
        }

        sendSubmitTagTree({
            variables: {
                input: {
                    id: rootId,
                    content: tagContent
                }
            }
        })

        if (submitTagTreeError) {
            toast.error('Error')
            console.log('Error: ' + submitTagTreeError.message)
        }

        if (submitTagTreeData) {
            toast.success('Submitted Tag Tree')
        }
    }

    const logTreeData = () => {
        console.log(tagTreeData)
    }

    const addDataToCircle = () => {
        setTagPackData(treeRef.current.props.data[0])
    }

    return (
        <div className='flex-col justify-between bg-amber-200 min-w-[300px]'>
            <div>
                <Button onClick={() => handleBasicData()}>Use Root</Button>
                <Button onClick={() => logTreeData()}>Log Tree Data</Button>
                <Button onClick={() => addDataToCircle()}>Add data to Circle</Button>
                <Button onClick={() => submitTagTree()}>Submit</Button>
            </div>
            <div>
                <Button onClick={() => setRefreshTagTree(!refreshTagTree)}>Refresh</Button>
                <Button onClick={() => setTagTreeData([])}>Clear</Button>
            </div>
            <div className='flex items-center bg-white m-2'>
                <input
                    type="text"
                    className='w-full'
                    value={rootId}
                    placeholder="Root Id to submit tagTree data"
                    onBlur={() => setAdminSearchTerm('')}
                    onChange={(e) => setRootId(e.currentTarget.value)}
                />
            </div>
            <div className='flex items-center bg-white m-2'>
                <Search className='flex items-center mr-2' />
                <input
                    type="text"
                    className='w-full'
                    value={adminSearchTerm}
                    placeholder="Search tags"
                    onBlur={() => setAdminSearchTerm('')}
                    onChange={(e) => setAdminSearchTerm(e.currentTarget.value)}
                />
            </div>
            {refreshTagTree ?
                <div>
                    {tagTreeData ?
                        <Tree
                            initialData={tagTreeData}
                            disableMultiSelection={true}
                            rowClassName={`focus:bg-slate-400 rounded-lg outline-none`}
                            searchTerm={adminSearchTerm}
                            ref={treeRef}
                        >
                            {AdminEditTagNode}
                        </Tree>
                        :
                        null
                    }
                </div>

                : null
            }

            <p className='flex justify-center'>
                Select and open the tag folder
            </p>
            <p className='flex justify-center'>
                <ArrowBigUp /> Shift + A: Create a tag
            </p>
            <p className='flex justify-center'>
                Hit Enter when done typing.
            </p>
        </div >

    )
}