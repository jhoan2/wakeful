import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SideBar from '../../components/SideBar';
import BottomNavBar from '../../components/BottomNavBar';
import ErrorPage from '../../components/ErrorPage';
import { useCeramicContext } from '../../context';
import { useQuery, gql } from '@apollo/client';
import ResourceSidePanel from '../../components/ResourceSidePanel';
import ResourceCardView from '../../components/ResourceCardView';
import SkeletonHomeCard from '../../components/SkeletonHomeCard';
import NoContent from '../../components/NoContent';
import ResourceAddNote from '../../components/ResourceAddNote';

export default function resource() {
  const router = useRouter()
  const resourceId = router.query.id
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [showModal, setShowModal] = useState(false)

  const GET_CARDS_FOR_RESOURCE = gql`
  query getCardsForResource ($resourceId: ID!, $account: ID!, $cursor: String) {
    node(id: $resourceId) {
      ... on IcarusResource {
        author
        createdAt
        description
        doi
        id
        mediaType
        isbn
        title
        updatedAt
        url
        cards(account: $account, first: 10, filters: {where: {deleted: {equalTo: false}}}, after: $cursor) {
          edges {
            node {
              id
              annotation
              quote
              cid
              updatedAt
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
    `

  const { loading, error, data, fetchMore } = useQuery(GET_CARDS_FOR_RESOURCE, {
    variables: { account: composeClient.id, resourceId: resourceId },
  });

  if (error) return <ErrorPage message={error.message} />;
  const cards = data?.node.cards.edges
  const resourceUrl = data?.node.url
  const pageInfo = data?.node.cards.pageInfo

  const getMoreCards = (pageInfo) => {
    if (pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
        },
      });
    }
  }

  return (
    <div className='flex h-screen'>
      <SideBar page={'home'} />
      {loading ?
        (<div className='md:flex'>
          <SkeletonHomeCard />
          <SkeletonHomeCard />
          <SkeletonHomeCard />
        </div>)
        :
        (
          data ?
            <div className='flex-grow flex-row  overflow-auto sm:justify-center'>
              <div>
                {cards.length > 0 ?
                  <ResourceCardView
                    cards={cards}
                    resourceId={resourceId}
                    resourceUrl={resourceUrl}
                    showModal={showModal}
                    setShowModal={setShowModal}
                  />
                  :
                  <div className='flex h-screen'>
                    <NoContent src='/no-content-cat.png' />
                    <button className='fixed top-12 md:right-12 lg:right-4 hidden md:block py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-blue-900 dark:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600' onClick={() => setShowModal(true)}>Add Note</button>
                    {showModal ?
                      <ResourceAddNote setShowModal={setShowModal} resourceId={resourceId} resourceUrl={resourceUrl} />
                      : null
                    }
                  </div>
                }
                <div className=' pb-24 md:pb-4 p-4'>
                  {pageInfo.hasNextPage ?
                    <button
                      className='hover:bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full  bg-yellow-100 w-full h-16  text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50'
                      onClick={() => getMoreCards(pageInfo)}
                    >
                      Load more
                    </button> :
                    null
                  }
                </div>
              </div>
              <ResourceSidePanel data={data} />
            </div>
            :
            <NoContent src='/no-content-cat.png' />
        )
      }
      <BottomNavBar
        setShowModal={setShowModal}
        page={'resource'}
      />
    </div>
  )
}
