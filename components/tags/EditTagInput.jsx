import React from 'react'
import { toast } from 'sonner';

export default function TagEditInput({ node, setLoadingTagCreate, setTagTreeChanged }) {

    const handleSubmit = async (e, node) => {
        let value = e.currentTarget.value
        if (value.length < 3) {
            toast.error('Tags must have at least 2 characters')
            return
        }

        setLoadingTagCreate(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/createTag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: e.currentTarget.value,
                parentId: node.parent.data.id
            })
        });

        if (!res.ok) {
            toast.error('Error receiving tag suggestion')
            throw new Error(`HTTP error! status: ${res.status}`);
        } else {
            toast.success('Successfully received tag suggestion')
        }
        node.submit(value)
        setTagTreeChanged(true)
        setLoadingTagCreate(false)
    }

    return (
        <input
            autoFocus
            type="text"
            defaultValue={node.data.name}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => node.reset()}
            onKeyDown={(e) => {
                if (e.key === "Escape") node.reset();
                if (e.key === "Enter") handleSubmit(e, node);
            }}
        />
    );
}