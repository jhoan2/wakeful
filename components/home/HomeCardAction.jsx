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
import { gql, useMutation } from '@apollo/client';

export default function HomeCardAction({ accountResourceId, readingStatus }) {
    const [position, setPosition] = useState(readingStatus)

    const UPDATE_ACCOUNT_RESOURCE_READING_STATUS = gql`
    mutation upduateAccountResourceReadingStatus($input: UpdateIdealiteAccountResourcesInput = {id: "", content: {}}) {
        updateIdealiteAccountResources(input: $input) {
          document {
            id
          }
        }
      }
    `

    const [updateAccountResourceReadingStatus] = useMutation(UPDATE_ACCOUNT_RESOURCE_READING_STATUS, {
        onError: (error) => {
            toast.error('Something went wrong with changing reading status.')
            console.log(error.message)
        }
    });

    const updateReadingState = async (readingStatus) => {
        setPosition(readingStatus)

        updateAccountResourceReadingStatus({
            variables: {
                input: {
                    id: accountResourceId,
                    content: {
                        readingStatus: readingStatus
                    }
                }
            }
        })
    }

    return (
        <div className='absolute top-3 right-5 z-50'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className='p-0' ><MoreVertical className='h-4 w-4 text-black' /></Button>
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
