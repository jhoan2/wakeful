import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';


export default function HomeCardAction({ accountResourceId, readingStatus }) {
    const [position, setPosition] = useState(readingStatus)

    const updateReadingState = async (readingStatus) => {
        setPosition(readingStatus)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/updateReadingStatus`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: accountResourceId,
                    readingStatus: readingStatus
                })
            })

            if (!res.ok) {
                toast.error('Something went wrong!')
                throw new Error('Server responded with an error: ' + res.error);
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='absolute top-3 right-5 z-50'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className='p-0' ><MoreVertical className='h-4 w-4 text-white' /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44">
                    <DropdownMenuLabel>Reading Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={position} onValueChange={(position) => updateReadingState(position)}>
                        <DropdownMenuRadioItem value="READING">Reading</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="ARCHIVED">Archived</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="DROPPED">Dropped</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
