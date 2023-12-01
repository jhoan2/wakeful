import React, { useState } from 'react'
import { useRouter } from 'next/router'
import SideBar from '../../components/SideBar'
import BottomNavBar from '../../components/BottomNavBar'
import ErrorPage from '../../components/ErrorPage'
import { useCeramicContext } from '../../context';
import { useQuery, gql } from '@apollo/client';
import ResourceSidePanel from '../../components/ResourceSidePanel'
import ResourceCardList from '../../components/ResourceCardList'
import SkeletonHomeCard from '../../components/SkeletonHomeCard'

export default function resource() {
  const router = useRouter()
  const resourceId = router.query.id
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients

  const GET_CARDS_FOR_RESOURCE = gql`
  query MyQuery ($resourceId: ID!, $account: ID!) {
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
        cards(account: $account, first: 10) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
    `

  const { loading, error, data, fetchMore } = useQuery(GET_CARDS_FOR_RESOURCE, {
    variables: { account: composeClient.id, resourceId: resourceId },
  });

  console.log(data)
  if (error) return <ErrorPage message={error.message} />;

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
              <ResourceCardList data={data} />
              <ResourceSidePanel data={data} />
            </div>
            :
            <NoContent src='/no-content-cat.png' />
        )
      }
      <BottomNavBar />
    </div>
  )
}
