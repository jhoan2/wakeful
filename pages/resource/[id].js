import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ErrorPage from '../../components/ErrorPage';
import { useCeramicContext } from '../../context';
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import ResourceSidePanel from '../../components/resource/ResourceSidePanel';
import ResourceCardView from '../../components/resource/ResourceCardView';
import SkeletonHomeCard from '../../components/SkeletonHomeCard';
import NoContent from '../../components/NoContent';
import ResourceAddNote from '../../components/resource/ResourceAddNote';
import Layout from '../../components/Layout';
import { Button } from "@/components/ui/button";

export default function Resource() {
  const router = useRouter()
  const resourceId = router.query.id
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [resourceUrl, setResourceUrl] = useState('')

  const GET_URL_FROM_ACCOUNT_RESOURCES = gql`
  query getUrlFromAccountResources {
      viewer {
        id
        idealiteAccountResourcesList(
          filters: {where: {resourceId: {equalTo: "${resourceId}"}}}
          first: 1
          ) {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  `

  const [getUrlFromAccountResource] = useLazyQuery(GET_URL_FROM_ACCOUNT_RESOURCES, {
    onCompleted: (data) => {
      if (data.viewer.idealiteAccountResourcesList.edges.length > 0) {
        setResourceUrl(data.viewer.idealiteAccountResourcesList.edges[0].node.url)
      }
    },
    onError: (error) => console.error(error.message)
  });

  const GET_CARDS_FOR_RESOURCE = gql`
  query getCardsForResource ($resourceId: ID!, $account: ID!, $cursor: String) {
    node(id: $resourceId) {
      ... on IdealiteResourcev2 {
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
        idealiteCards(account: $account, first: 10, filters: {where: {deleted: {equalTo: false}}}, after: $cursor, sorting: {updatedAt: DESC}) {
          edges {
            node {
              id
              annotation
              quote
              cid
              updatedAt
              googleBooksPage
              tags {
                name
                tagId
              }
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
    onCompleted: (data) => {
      if (data.node.url === null) {
        //If the user is adding a note from the web for a google play books resource, 
        //the url is null so the ext doesn't get the cards for it
        //If the resoureUrl is null, we use the id to query for the url in the accountResource 
        getUrlFromAccountResource()
      } else {
        setResourceUrl(data.node.url)
      }
    }
  });


  if (error) return <ErrorPage message={error.message} />;
  const cards = data?.node.idealiteCards.edges
  const resourceTitle = data?.node.title
  const pageInfo = data?.node.idealiteCards.pageInfo

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
    <div className='flex justify-center h-screen w-full'>
      {loading ?
        (<div className='md:flex'>
          <SkeletonHomeCard />
          <SkeletonHomeCard />
          <SkeletonHomeCard />
        </div>)
        :
        (
          data ?
            <div className='flex-grow flex-row overflow-auto sm:justify-center'>
              <div>
                {cards && cards.length > 0 ?
                  <ResourceCardView
                    cards={cards}
                    resourceId={resourceId}
                    resourceUrl={resourceUrl}
                    showResourceModal={showResourceModal}
                    setShowResourceModal={setShowResourceModal}
                    setResourceUrl={setResourceUrl}
                    resourceTitle={resourceTitle}
                  />
                  :
                  <div className='flex flex-col h-screen'>
                    <p className='text-3xl font-bold p-8 text-balance'>{resourceTitle}</p>
                    <div className='grid grid-cols-3'>
                      <div></div>
                      <div className='flex justify-end'>
                        <Button
                          variant='secondary'
                          onClick={() => setShowResourceModal(true)}
                        >
                          Add Note
                        </Button>
                        {showResourceModal ?
                          <ResourceAddNote
                            setShowResourceModal={setShowResourceModal}
                            resourceId={resourceId}
                            resourceUrl={resourceUrl}
                          />
                          : null
                        }
                        <NoContent src='/no-content-cat.png' />
                      </div>
                      <div></div>
                    </div>
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
    </div>
  )
}

Resource.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}