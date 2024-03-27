import React from 'react'
import { toast } from 'sonner';
import { gql, useMutation, useLazyQuery } from '@apollo/client';

export default function AdminEditTagInput({ node }) {

    return (
        <input
            autoFocus
            type="text"
            defaultValue={node.data.name}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => node.reset()}
            onKeyDown={(e) => {
                if (e.key === "Escape") node.reset();
                if (e.key === "Enter") node.submit(e.currentTarget.value);
            }}
        />
    );
}