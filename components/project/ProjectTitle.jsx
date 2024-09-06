import React from 'react'
import { useQuery, gql } from '@apollo/client';
import { toast } from 'sonner';
import NoContent from '../NoContent';
import { Button } from "@/components/ui/button";
import ProjectAddNote from './ProjectAddNote';
import ProjectSidePanel from './ProjectSidePanel';

export default function ProjectTitle({
  projectId,
  setShowProjectModal,
  showProjectModal
}) {
  if (!projectId) return (<></>)

  const GET_PROJECT_TITLE = gql`
    query getProjectTitle($projectId: ID!){
        node(id: $projectId) {
          ... on IdealiteProjectv1 {
            url
            updatedAt
            title
            status
            id
            description
            createdAt
            eventImage
            eventChildId
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
      }
`

  const { loading, error, data } = useQuery(GET_PROJECT_TITLE, {
    variables: { projectId: projectId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error)
    toast.error('Something went getting project title!')
  }
  return (
    <div className='w-full'>
      <p className='text-3xl font-bold p-8'>{data?.node.title}</p>
      <div className='flex flex-col items-center overflow-auto sm:justify-center'>
        <div className='space-y-6 space-x-2'>
          <Button variant='secondary' onClick={() => setShowProjectModal(true)}>Add Note</Button>
          {showProjectModal ?
            <ProjectAddNote projectId={projectId} setShowProjectModal={setShowProjectModal} />
            :
            null
          }
          <NoContent src='/no-content-cat.png' />
          <ProjectSidePanel projectData={data.node} category={'projectTitle'} />
        </div>
      </div>
    </div>

  )
}
