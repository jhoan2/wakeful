import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MoveLeft, Search } from 'lucide-react';
import { Tree } from "react-arborist";
import EditTagTree from './EditTagTree';
import TagNode from './TagNode';
import { useProfileContext } from '../../context';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

export default function TagTree({ setShowTags }) {
    const { profile } = useProfileContext();
    const [showEditTags, setShowEditTags] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [originalTags, setOriginalTags] = useState(JSON.stringify(profile.tags))
    const [loadingSaveTagChanges, setLoadingSaveTagChanges] = useState(false)
    const [tagTreeChanged, setTagTreeChanged] = useState(false)

    const SAVE_TAG_CHANGES = gql`
    mutation MyMutation($input: UpdateIdealiteProfileInput!) {
        updateIdealiteProfile(input: $input) {
          document {
            id
          }
        }
      }
    `


    const [sendSaveTagChanges] = useMutation(SAVE_TAG_CHANGES, {
        onCompleted: () => toast.success('Submitted changes')
    });

    const saveTagChanges = async () => {
        const jsonTagTreeData = JSON.stringify(profile.tags)

        try {
            setLoadingSaveTagChanges(true)
            await sendSaveTagChanges({
                variables: {
                    input: {
                        id: profile.id,
                        content: {
                            updatedAt: new Date().toISOString(),
                            tags: jsonTagTreeData,
                        }
                    }
                }
            })
        } catch (error) {
            toast.error('Something went wrong saving tags')
            console.log(error.message)
        }

        setLoadingSaveTagChanges(false)
    }

    if (!profile.id) {
        return (
            <div>
                <Button variant='secondary' onClick={() => setShowTags(false)} className='hover:bg-slate-400 w-1/2 flex justify-start'>
                    <MoveLeft /> Go Back
                </Button>
                <div className='flex justify-center '>
                    <p>Please create profile first</p>
                </div>
            </div>
        )
    }

    if (!profile.tags || profile.tags.length === 0) {
        return (
            <div>
                <Button variant='secondary' onClick={() => setShowTags(false)} className='hover:bg-slate-400 w-1/2 flex justify-start'>
                    <MoveLeft /> Go Back
                </Button>
                <div className='flex justify-center'>
                    <p>No tags. Checkout the explore page</p>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (originalTags != (JSON.stringify(profile.tags))) {
            setTagTreeChanged(true)
        }

    }, [profile.tags])

    return (
        <div>
            <div>
                {showEditTags ?
                    <div className='flex justify-end'>
                        <Button variant='secondary' onClick={() => setShowEditTags(false)} className='hover:bg-slate-400 w-1/2 flex justify-center text-red-500'>
                            Cancel Edit(s)
                        </Button>
                    </div>
                    :
                    <div className='flex justify-between'>
                        <Button variant='secondary' onClick={() => setShowTags(false)} className='hover:bg-slate-400 w-1/2 flex justify-start'>
                            <MoveLeft /> Go Back
                        </Button>
                        <Button variant='secondary' onClick={() => setShowEditTags(true)} className='hover:bg-slate-400 w-1/2 flex justify-center'>
                            Edit Tags
                        </Button>
                    </div>
                }
                <div className='flex items-center bg-white m-2'>
                    <Search className='flex items-center mr-2' />
                    <input
                        type="text"
                        className='w-full'
                        value={searchTerm}
                        placeholder="Search tags"
                        onBlur={() => setSearchTerm('')}
                        onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    />
                </div>
                {showEditTags ?
                    <EditTagTree
                        data={profile.tags}
                        originalTags={originalTags}
                        setTagTreeChanged={setTagTreeChanged}
                    />
                    : <Tree
                        data={profile.tags}
                        disableDrag={true}
                        disableDrop={true}
                        searchTerm={searchTerm}
                    >
                        {TagNode}
                    </Tree>
                }

                {
                    tagTreeChanged ?
                        <div className='flex justify-center'>
                            {
                                loadingSaveTagChanges ?
                                    <Button>Saving...</Button>
                                    :
                                    <Button onClick={() => saveTagChanges()}>Save Changes</Button>
                            }
                        </div>
                        :
                        null
                }
            </div>
        </div>
    )
}
