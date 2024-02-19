import React from 'react'
import { useQuery, gql } from '@apollo/client';
import { toast } from 'sonner';

export default function ProjectTitle({ projectId }) {
    const GET_PROJECT_TITLE = gql`
    query getProjectTitle($projectId: ID!){
        node(id: $projectId) {
          ... on IdealiteProject {
            title
          }
        }
      }
`

    const { loading, error, data } = useQuery(GET_PROJECT_TITLE, {
        variables: { projectId: projectId },
    });

    if (loading) return <p>Loading...</p>;
    if (error) {
        toast.error('Something went getting project title!')
    }
    return (
        <p className='text-3xl font-bold p-8'>{data?.node.title}</p>
    )
}
