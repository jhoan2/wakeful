import React, { useState } from 'react'
import { useRouter } from 'next/router';
import ProjectAddNote from '../../components/project/ProjectAddNote';
import { Button } from "@/components/ui/button";
import { useQuery, gql } from '@apollo/client';
import ErrorPage from '../../components/ErrorPage';
import SkeletonHomeCard from '../../components/SkeletonHomeCard';
import ProjectSidePanel from '../../components/project/ProjectSidePanel';
import ProjectCard from '../../components/project/ProjectCard';
import Layout from '../../components/Layout';
import ProjectTitle from '../../components/project/ProjectTitle';


export default function ProjectPage() {
    const [showProjectModal, setShowProjectModal] = useState(false)
    const router = useRouter()
    const projectId = router.query.id

    const GET_USERS_PROJECT_CARD_COLLECTION = gql`
        query getUsersProjectCardCollection($projectId: String, $cursor: String) {
            viewer {
                id
                idealiteProjectCardCollectionv1List(
                    after: $cursor,
                    first: 20,
                    filters: {where: {deleted: {equalTo: false}, projectId: {equalTo: $projectId}}}
                ) {
                    edges {
                        node {
                            id
                            idealiteCard {
                                id
                                cid
                                annotation
                                altText
                                createdAt
                                deleted
                                pageYOffset
                                quote
                                resourceId
                                scrollHeight
                                updatedAt
                                url
                                videoTime
                            }
                            project {
                                url
                                updatedAt
                                title
                                status
                                id
                                description
                                createdAt
                                eventImage
                                eventChildId
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
                            }
                        }
                    }
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                }
            }
        }
    `

    const { loading, error, data, fetchMore } = useQuery(GET_USERS_PROJECT_CARD_COLLECTION, {
        variables: { projectId: projectId },
    });

    const getMoreProjectCards = (pageInfo) => {
        if (pageInfo.hasNextPage) {
            fetchMore({
                variables: {
                    cursor: pageInfo.endCursor,
                },
            });
        }
    }

    if (error) return <ErrorPage message={error.message} />;
    const cards = data?.viewer?.idealiteProjectCardCollectionv1List.edges
    const pageInfo = data?.viewer?.idealiteProjectCardCollectionv1List.pageInfo

    return (
        <div className='flex justify-center h-screen w-full'>
            {loading ?
                (<div className='md:flex'>
                    <SkeletonHomeCard />
                    <SkeletonHomeCard />
                    <SkeletonHomeCard />
                </div>)
                :
                (
                    cards && cards.length > 0 ?
                        <div className='flex-grow  overflow-auto sm:justify-center flex-wrap'>
                            <p className='text-3xl font-bold p-8'>{cards[0].node.project.title}</p>
                            <div className='grid grid-cols-3'>
                                <div></div>
                                <div className='flex justify-end space-x-2'>
                                    <Button
                                        variant='secondary'
                                        onClick={() => setShowProjectModal(true)}
                                    >
                                        Add Note
                                    </Button>
                                    {showProjectModal ?
                                        <ProjectAddNote projectId={projectId} setShowProjectModal={setShowProjectModal} />
                                        :
                                        null
                                    }
                                </div>
                                <div></div>
                            </div>
                            <div className='flex justify-center'>
                                <div className='grid grid-cols-1 sm:grid-cols-3'>
                                    {cards.map((card) => {
                                        return <ProjectCard key={card.node.idealiteCard.id} card={card.node} />
                                    })}
                                </div>
                            </div>

                            <div className=' pb-24 md:pb-4 p-4'>
                                {pageInfo.hasNextPage ?
                                    <Button
                                        variant='yellow'
                                        onClick={() => getMoreProjectCards(pageInfo)}
                                    >
                                        Load more
                                    </Button> :
                                    null
                                }
                            </div>
                            <ProjectSidePanel projectData={cards[0].node.project} category={'project'} />
                        </div>
                        :
                        <ProjectTitle
                            projectId={projectId}
                            setShowProjectModal={setShowProjectModal}
                            showProjectModal={showProjectModal}
                        />
                )
            }
        </div>

    )
}

ProjectPage.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}