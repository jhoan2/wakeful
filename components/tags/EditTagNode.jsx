import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Tag, X } from 'lucide-react';
import EditTagInput from './EditTagInput';
import { useProfileContext } from '../../context';


export default function EditTagNode({ node, style, tree }) {
    const [loadingTagCreate, setLoadingTagCreate] = useState(false);
    const { updateTagTree } = useProfileContext();

    const deleteNodeFromTags = (nodeId) => {
        tree.delete(nodeId)
        updateTagTree(tree.props.data)
    }

    return (
        <div className='flex justify-between'>
            <div
                style={style}
                className={`flex items-center ${node.isInternal && 'cursor-pointer'}`}
                onClick={() => node.isInternal && node.toggle()}
            >
                <span>
                    {node.isInternal ? (
                        node.isOpen ? (
                            <ChevronDown />
                        ) : (
                            <ChevronRight />
                        )
                    ) : null}
                </span>
                <Tag className='h-3' />
                {loadingTagCreate ?
                    <p>Creating...</p>
                    :
                    <span>
                        {
                            node.isEditing ?
                                <EditTagInput className='w-[24px]' node={node} setLoadingTagCreate={setLoadingTagCreate} />
                                :
                                node.data.name
                        }
                    </span>
                }

            </div>
            <button className='hover:bg-red-200 rounded-full' onClick={() => deleteNodeFromTags(node.id)}>
                <X className='h-3' />
            </button>
        </div>
    )
}
