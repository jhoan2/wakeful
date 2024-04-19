import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ReadingStatusFilter({ setReadingStatus }) {
    const [showReading, setShowReading] = useState(true)
    const [showArchived, setShowArchived] = useState(false)
    const [showDropped, setShowDropped] = useState(false)

    const updateReadingStatusFilters = () => {
        let arrFilters = [];

        if (showReading) {
            arrFilters.push('READING');
        }
        if (showArchived) {
            arrFilters.push('ARCHIVED');
        }
        if (showDropped) {
            arrFilters.push('DROPPED');
        }

        setReadingStatus(arrFilters)
    }

    useEffect(() => {
        updateReadingStatusFilters();
    }, [showReading, showArchived, showDropped]);

    return (
        <div className='grid grid-cols-3'>
            <div></div>
            <div className='flex justify-end'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className='p-0' >Reading Status</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuCheckboxItem
                            checked={showReading}
                            onCheckedChange={setShowReading}
                        >
                            Reading
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showArchived}
                            onCheckedChange={setShowArchived}
                        >
                            Archived
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showDropped}
                            onCheckedChange={setShowDropped}
                        >
                            Dropped
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div></div>
        </div>
    )
}
