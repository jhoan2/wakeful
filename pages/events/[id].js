import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import DynamicOGTags from '../../components/DynamicOGTags';
import { Button } from "@/components/ui/button";
import { useQuery, gql } from '@apollo/client';
import ErrorPage from '../../components/ErrorPage';
import EventSidePanel from '../../components/event/EventSidePanel';

export default function EventPage() {
    const router = useRouter()
    const eventId = router.query.id

    const GET_EVENT_DETAILS = gql`
        query GetEventDetails($eventId: ID!) {
            node(id: $eventId) {
                ... on IdealiteProjectv1 {
                id
                clientMutationId
                isPublic
                deleted
                hostFarcasterId
                hostDisplayName
                hostAvatarCid
                eventChildId
                eventCastHash
                endTimestamp
                description
                createdAt
                cid
                projectParentId
                startTimestamp
                status
                tags(first: 10, filters: {where: {deleted: {equalTo: false}}}) {
                    edges {
                        node {
                            id
                            idealiteTag {
                                name
                                id
                            }
                        }
                    }
                }
                title
                updatedAt
                url
                }
            }
        }
    `;

    const { loading, error, data } = useQuery(GET_EVENT_DETAILS, {
        variables: { eventId },
        skip: !eventId,
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <ErrorPage message={error.message} />;

    return (
        <>
            {/* <DynamicOGTags
                title={`${event.title} | Your App Name`}
                description={event.description}
                image={ogImage}
                url={ogUrl}
                type="article"
            /> */}
            <div className='flex justify-center w-full h-screen'>
                {loading ? (
                    <div>
                        <p>Loading...</p>
                    </div>
                ) : data?.node ? (
                    <EventSidePanel data={data.node} />
                ) : (
                    <div>
                        <p>Event not found</p>
                    </div>
                )}
            </div>
        </>
    )
}

EventPage.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}