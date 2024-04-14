import React from 'react'
import EditTagNode from './EditTagNode';
import { Tree } from "react-arborist";
import { ArrowBigUp } from 'lucide-react';

export default function EditTagTree({ data, setTagTreeChanged }) {
    return (
        <div className='flex-col justify-between'>
            <Tree
                initialData={data}
                disableMultiSelection={true}
                disableDrag={true}
                disableDrop={true}
                rowClassName={`focus:bg-slate-400 rounded-lg outline-none`}
                setTagTreeChanged={setTagTreeChanged}
            >
                {EditTagNode}
            </Tree>
            <p className='flex justify-center'>
                Select and open the tag folder
            </p>
            <p className='flex justify-center'>
                <ArrowBigUp /> Shift + A: Create a tag
            </p>
            <p className='flex justify-center'>
                Hit Enter when done typing.
            </p>
        </div>

    )
}
