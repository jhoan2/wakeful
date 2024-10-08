import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client';
import HomeCardList from '../../components/home/HomeCardList';
import SkeletonHomeCard from '../../components/SkeletonHomeCard';
import NoContent from '../../components/NoContent';
import ErrorPage from '../../components/ErrorPage';
import Layout from '../../components/Layout';
import { useCeramicContext } from '../../context';
import ReadingStatusFilter from '../../components/home/ReadingStatusFilter';
import { Button } from "@/components/ui/button";
import HomeAddResource from '../../components/home/HomeAddResource';
import { toast } from 'sonner';

export default function Home() {
  const clients = useCeramicContext()
  const { composeClient } = clients
  const [readingStatus, setReadingStatus] = useState([])
  const [showAddResourceModal, setShowAddResourceModal] = useState(false)

  const GET_CARDS_PER_URL_PER_USER = gql`
  query GetCardsPerUrlPerUser ($filters: IdealiteAccountResourcesv1FiltersInput, $cursor: String){
    idealiteAccountResourcesv1Index (after: $cursor, first: 10, filters: $filters, sorting: {updatedAt: DESC} ){
      edges {
        node {
          id
          readingStatus
          resource {
            cid
            title
            id
            url
            updatedAt
          }
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
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  `

  const createFilters = () => {
    let filters = {
      where: {
        recipient: { equalTo: composeClient.id },
        readingStatus: { in: [...readingStatus] }
      }
    }

    if (filters.where.readingStatus.in.length === 0) {
      filters.where.readingStatus.in.push('READING')
    }

    return filters
  }

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_CARDS_PER_URL_PER_USER, {
    variables: { filters: createFilters() },
  });



  const resources = data?.idealiteAccountResourcesv1Index?.edges
  const pageInfo = data?.idealiteAccountResourcesv1Index?.pageInfo


  const getMoreResources = (pageInfo) => {
    if (pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
        },
      });
    }
  }

  useEffect(() => {
    refetch();
  }, [readingStatus]);

  if (error) return <ErrorPage message={error.message} />;

  const handleClick = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_RESOURCE_URL}/api/handleObsidianPlugin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({
      //   resources: [{ url: 'https://youtu.be/E6oJ7a6X6Kw?si=CPi5IBCrIPsuh-kw' }, { book__title: 'Clear Thinking' }]
      // }),
      body: JSON.stringify({
        resources: [{ book__title: 'Clear Thinking' }]
      }),
    })
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
          resources.length > 0 ?
            <div className='flex-grow flex-row overflow-auto sm:justify-center'>
              <div className='grid grid-cols-3'>
                <div></div>
                <div className='flex justify-between'>
                  <ReadingStatusFilter
                    setReadingStatus={setReadingStatus}
                  />
                  {composeClient.id ?
                    <Button
                      variant='secondary'
                      onClick={() => setShowAddResourceModal(true)}
                    >
                      Add Resource
                    </Button>
                    :
                    null}
                </div>
              </div>
              {showAddResourceModal ?
                <HomeAddResource
                  setShowAddResourceModal={setShowAddResourceModal}
                />
                : null
              }
              <HomeCardList
                resources={resources}
                getMoreResources={getMoreResources}
                pageInfo={pageInfo}
              />
              <div className=' pb-24 md:pb-4 p-4 flex justify-center items-center'>
                {pageInfo.hasNextPage ?
                  <Button variant='yellow'
                    onClick={() => getMoreResources(pageInfo)}
                  >
                    Load more
                  </Button> :
                  null
                }
              </div>
            </div>
            :
            <div className='flex flex-col h-screen'>
              <p className='text-3xl font-bold p-8 text-balance'></p>
              <div className='grid grid-cols-3'>
                <div></div>
                <div><Button onClick={() => handleClick()}>ClickToSendReq</Button></div>
                <div className='flex justify-end'>
                  {composeClient.id ?
                    <Button
                      variant='secondary'
                      onClick={() => setShowAddResourceModal(true)}
                    >
                      Add Resource
                    </Button>
                    :
                    null}
                  {showAddResourceModal ?
                    <HomeAddResource
                      setShowAddResourceModal={setShowAddResourceModal}
                    />
                    : null
                  }
                </div>
              </div>
              <NoContent src='/no-content-cat.png' />
            </div>
        )
      }
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}