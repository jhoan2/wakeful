import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client';
import HomeCardList from '../../components/home/HomeCardList';
import SkeletonHomeCard from '../../components/SkeletonHomeCard';
import NoContent from '../../components/NoContent';
import ErrorPage from '../../components/ErrorPage';
import Layout from '../../components/Layout';
import { useCeramicContext } from '../../context';
import ReadingStatusFilter from '../../components/home/ReadingStatusFilter';

export default function Home() {
  const clients = useCeramicContext()
  const { composeClient } = clients
  const [readingStatus, setReadingStatus] = useState([])

  const GET_CARDS_PER_URL_PER_USER = gql`
  query GetCardsPerUrlPerUser ($filters: IdealiteAccountResourcesFiltersInput, $cursor: String){
    idealiteAccountResourcesIndex (after: $cursor, first: 10, filters: $filters, sorting: {updatedAt: DESC} ){
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
          tags {
            tagId
            name
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


  if (error) return <ErrorPage message={error.message} />;

  const resources = data?.idealiteAccountResourcesIndex.edges
  const pageInfo = data?.idealiteAccountResourcesIndex.pageInfo


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
            <div className='flex-grow flex-row  overflow-auto sm:justify-center'>
              <ReadingStatusFilter
                setReadingStatus={setReadingStatus}
              />
              <HomeCardList
                resources={resources}
                getMoreResources={getMoreResources}
                pageInfo={pageInfo}
              />
              <div className=' pb-24 md:pb-4 p-4'>
                {pageInfo.hasNextPage ?
                  <button
                    className='hover:bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full  bg-yellow-100 w-full h-16  text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50'
                    onClick={() => getMoreResources(pageInfo)}
                  >
                    Load more
                  </button> :
                  null
                }
              </div>
            </div>
            :
            <NoContent src='/no-content-cat.png' />
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