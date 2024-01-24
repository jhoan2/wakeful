import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useCeramicContext } from '../../context';
import { useQuery, gql } from '@apollo/client';
import { authenticateCeramic } from "../../utils";
import HomeCardList from '../../components/HomeCardList';
import SkeletonHomeCard from '../../components/SkeletonHomeCard';
import NoContent from '../../components/NoContent';
import ErrorPage from '../../components/ErrorPage';
import { Button } from '@/components/ui/button';
import Layout from '../../components/Layout';
export default function Home() {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const router = useRouter()

  // const handleLogin = () => {
  //   authenticateCeramic(ceramic, composeClient)
  // }

  const GET_CARDS_PER_URL_PER_USER = gql`
  query GetCardsPerUrlPerUser ($account: String, $cursor: String){
    accountResourcesIndex (after: $cursor, first: 5, filters: {where: {recipient: {equalTo: $account}}}, sorting: {updatedAt: DESC} ){
      edges {
        node {
          resource {
            cid
            title
            id
            url
            updatedAt
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



  // useEffect(() => {
  //   if (localStorage.getItem('ceramic:eth_did')) {
  //     handleLogin()
  //   }

  // }, [])

  const { loading, error, data, fetchMore } = useQuery(GET_CARDS_PER_URL_PER_USER, {
    variables: { account: composeClient.id },
  });

  if (error) return <ErrorPage message={error.message} />;

  const resources = data?.accountResourcesIndex.edges
  const pageInfo = data?.accountResourcesIndex.pageInfo


  const getMoreResources = (pageInfo) => {
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
          resources.length > 0 ?
            <div className='flex-grow flex-row  overflow-auto sm:justify-center'>
              <HomeCardList resources={resources} getMoreResources={getMoreResources} pageInfo={pageInfo} />
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