import React from 'react';
import { Tree } from "react-arborist";
import { useProfileContext } from '../context';
import ContextMenuTagNode from './ContextMenuTagNode';

export default function ContextMenuTree({ cardId, category, tags }) {
    const { profile } = useProfileContext()
    return (
        <div>
            <Tree
                initialData={profile.tags}
                disableDrag={true}
                disableDrop={true}
                disableEdit={true}
                height={150}
                width={196}
                openByDefault={false}
                cardId={cardId}
                category={category}
                tags={tags}
            >
                {ContextMenuTagNode}
            </Tree>
        </div>
    )
}
