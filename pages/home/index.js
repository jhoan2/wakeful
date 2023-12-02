import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useCeramicContext } from '../../context';
import { useQuery, gql } from '@apollo/client';
import { authenticateCeramic } from "../../utils";
import SideBar from '../../components/SideBar';
import HomeCardList from '../../components/HomeCardList';
import BottomNavBar from '../../components/BottomNavBar';
import SkeletonCard from '../../components/SkeletonCard';
import NoContent from '../../components/NoContent';
import ErrorPage from '../../components/ErrorPage';

export default function index() {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const router = useRouter()
  const handleLogout = () => {
    localStorage.setItem("logged_in", "false")
    localStorage.removeItem('ceramic:did_seed')
    localStorage.removeItem('ceramic:eth_did')
    localStorage.removeItem('did')
    localStorage.removeItem('ceramic:auth_type')
    router.push('/')
  }

  const handleLogin = () => {
    authenticateCeramic(ceramic, composeClient)
  }

  const GET_CARDS_PER_URL_PER_USER = gql`
  query MyQuery ($account: String){
    accountResourcesIndex(first: 10, filters: {where: {recipient: {equalTo: $account}}}) {
      edges {
        node {
          resource {
            cid
            title
            id
          }
        }
      }
    }
  }
  `

  useEffect(() => {
    if (localStorage.getItem('ceramic:eth_did')) {
      handleLogin()
    }

  }, [])

  const { loading, error, data, fetchMore } = useQuery(GET_CARDS_PER_URL_PER_USER, {
    variables: { account: composeClient.id },
  });

  if (error) return <ErrorPage message={error.message} />;

  const resources = data?.accountResourcesIndex.edges
  return (
    <div className='flex h-screen'>
      <SideBar />
      {loading ?
        (<div className='md:flex'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>)
        :
        (
          resources.length > 0 ?
            <div className='flex-grow flex-row  overflow-auto sm:justify-center'>
              <HomeCardList resources={resources} getMoreResources={getMoreResources} pageInfo={pageInfo} />
              <div className=' pb-24 md:pb-4 p-4'>
                <button
                  className='hover:bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full  bg-yellow-100 w-full h-16  text-sm font-semibold rounded-full border border-transparent text-gray-500 disabled:opacity-50'
                  onClick={() => getMoreResources(pageInfo)}>
                  Load more
                </button>
              </div>
            </div>
            :
            <NoContent src='/no-content-cat.png' />
        )
      }
      <BottomNavBar />
    </div>
  )
}
