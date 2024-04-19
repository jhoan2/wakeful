import React from 'react'
import { ChevronDown, ChevronRight, Tag } from 'lucide-react'
import TagEditInput from './EditTagInput'

export default function TagNode({ node, style }) {
    return (
        <div
            style={style}
            className={`flex items-center ${node.isInternal && 'cursor-pointer'} hover:bg-slate-400`}
        >
            <span onClick={() => node.isInternal && node.toggle()}>
                {node.isInternal ? (
                    node.isOpen ? (
                        <ChevronDown />
                    ) : (
                        <ChevronRight />
                    )
                ) : null}
            </span>
            <Tag className='h-3' />
            <span>
                {node.isEditing ? <TagEditInput className='w-[24px]' node={node} /> : node.data.name}
            </span>
        </div>
    )
}
