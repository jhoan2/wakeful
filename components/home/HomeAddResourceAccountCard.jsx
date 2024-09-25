import React from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';

export default function HomeAddResourceAccountCard({
    title,
    createdAt,
    updatedAt,
    cid,
    resourceId
}) {
    const daysSinceCreated = Math.floor((new Date - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    const daysSinceUpdated = Math.floor((new Date - new Date(updatedAt)) / (1000 * 60 * 60 * 24));
    return (
        <div>
            <Link href={`/resource/${resourceId}`} >
                <Card className='hover:shadow-lg'>
                    <CardHeader>
                        {
                            cid ?
                                <img className="aspect-square object-cover rounded-t-lg "
                                    src={`${cid}?img-width=384`}
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; //prevent looping
                                        currentTarget.src = '/home-card-gradient.png'
                                    }}
                                    crossOrigin='anonymous'
                                    alt="Image Description" />
                                :
                                null
                        }
                    </CardHeader>
                    <CardContent>
                        <CardTitle>{title}</CardTitle>
                    </CardContent>
                    <CardFooter className='inline-block'>
                        <p>{`Created ${daysSinceCreated}d`}</p>
                        <p>{`Updated ${daysSinceUpdated}d`}</p>
                    </CardFooter>
                </Card>
            </Link>
        </div>
    )
}
