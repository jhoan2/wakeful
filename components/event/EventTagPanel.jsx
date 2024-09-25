import React from 'react'
import { Button } from '@/components/ui/button';

export default function EventTag({ name }) {
    return (
        <Button
            variant='secondary'
            size='small'
            className='pr-2 pl-2 bg-amber-200 cursor-default hover:bg-amber-200'
        >
            {name}
        </Button>
    )
}
