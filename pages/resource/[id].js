import React from 'react'
import { useRouter } from 'next/router'
import SideBar from '../../components/SideBar'
import BottomNavBar from '../../components/BottomNavBar'
import ErrorPage from '../../components/ErrorPage'
import { useCeramicContext } from '../../context';
import { useQuery, gql } from '@apollo/client';

export default function resource() {
    const router = useRouter()
    const resourceId = router.query.id
    const clients = useCeramicContext()
    const { ceramic, composeClient } = clients

    const GET_CARDS_FOR_RESOURCE = gql`
    query MyQuery {
        viewer {
          icarusResourceList(filters: {where: {url: {equalTo: ""}}}) {
            edges {
              node {
                cards {
                  edges {
                    node {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const { loading, error, data, fetchMore } = useQuery(GET_CARDS_FOR_RESOURCE, {
        variables: { account: composeClient.id },
    });

    if (error) return <ErrorPage message={error.message} />;

    console.log(data)
    return (
        <div className='flex h-screen'>
            <SideBar />
            <BottomNavBar />
        </div>
    )
}
