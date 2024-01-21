import React, { useState } from 'react'
import { useRouter } from 'next/router';
import ProjectAddNote from '../../components/project/ProjectAddNote';
import { Button } from "@/components/ui/button";
import { useQuery, gql } from '@apollo/client';
import ErrorPage from '../../components/ErrorPage';
import NoContent from '../../components/NoContent';
import SkeletonHomeCard from '../../components/SkeletonHomeCard';
import ProjectSidePanel from '../../components/project/ProjectSidePanel';
import ProjectCard from '../../components/project/ProjectCard';
import Layout from '../../components/Layout';


export default function ProjectPage() {
    const [showProjectModal, setShowProjectModal] = useState(false)
    const router = useRouter()
    const projectId = router.query.id

    const GET_USERS_PROJECT_CARD_COLLECTION = gql`
        query getUsersProjectCardCollection ($projectId: String, $cursor: String) {
            viewer {
            idealiteProjectCardCollectionList(
                after: $cursor,
                first: 20,
                filters: {where: {deleted: {equalTo: false}, projectId: {equalTo: $projectId}}}
            ) {
                edges {
                node {
                    id
                    card {
                        id
                        cid
                        annotation
                        altText
                        createdAt
                        deleted
                        pageYOffset
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
                        priority
                        id
                        description
                        createdAt
                        cid
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
    const cards = data?.viewer?.idealiteProjectCardCollectionList.edges
    const pageInfo = data?.viewer?.idealiteProjectCardCollectionList.pageInfo

    return (
        <div className='flex justify-center h-screen'>
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
                                <div className='flex justify-end'>
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
                            <div className='grid grid-cols-1 sm:grid-cols-3'>
                                {cards.map((card) => {
                                    return <ProjectCard key={card.node.card.id} card={card.node} />
                                })}
                            </div>

                            <div className=' pb-24 md:pb-4 p-4'>
                                {pageInfo.hasNextPage ?
                                    <button
                                        className='hover:bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full  bg-yellow-100 w-full h-16  text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50'
                                        onClick={() => getMoreProjectCards(pageInfo)}
                                    >
                                        Load more
                                    </button> :
                                    null
                                }
                            </div>
                            <ProjectSidePanel projectData={cards[0].node.project} />
                        </div>
                        :
                        <div className='flex flex-col items-center overflow-auto sm:justify-center'>
                            <div className='space-y-6'>
                                <Button variant='secondary' onClick={() => setShowProjectModal(true)}>Add Note</Button>
                                {showProjectModal ?
                                    <ProjectAddNote projectId={projectId} setShowProjectModal={setShowProjectModal} />
                                    :
                                    null
                                }
                                <NoContent src='/no-content-cat.png' />
                            </div>
                        </div>
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