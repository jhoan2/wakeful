import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Tag, X } from 'lucide-react';
import AdminEditTagInput from './AdminEditTagInput'

export default function AdminEditTagNode({ node, style, tree, dragHandle }) {
    return (
        <div className='flex justify-between'>
            <div
                style={style}
                className={`flex items-center ${node.isInternal && 'cursor-pointer'}`}
                onClick={() => node.isInternal && node.toggle()}
                ref={dragHandle}
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
                <span>{node.data.name}</span>
            </div>
            <button className='hover:bg-red-200 rounded-full' onClick={() => tree.delete(node.id)}>
                <X className='h-3' />
            </button>
        </div>
    )
}