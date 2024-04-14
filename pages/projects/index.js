import React from 'react'
import { useQuery, gql } from '@apollo/client';
import ErrorPage from '../../components/ErrorPage';
import DataTable from '../../components/project/DataTable';
import { Columns } from '../../components/project/Columns';
import { Loader2 } from 'lucide-react';
import Layout from '../../components/Layout';

export default function Projects() {
    const GET_USERS_PROJECTS = gql`
        query getUsersProjects {
            viewer {
                id
                idealiteProjectList(first: 100, filters: {where: {deleted: {equalTo: false}}}) {
                    edges {
                        node {
                            id
                            title
                            priority
                            status
                            description
                            createdAt
                            updatedAt
                            tags {
                                tagId
                                name
                              }
                        }
                    }
                }
            }
        }
    `

    const { loading, error, data } = useQuery(GET_USERS_PROJECTS);
    if (error) return <ErrorPage message={error.message} />;
    const projects = data?.viewer?.idealiteProjectList.edges.map((edge) => edge.node)
    return (
        <div className='flex justify-center w-full h-screen'>
            {loading ?
                (<div className='flex h-screen items-center'>
                    <Loader2 className='animate-spin' />
                </div>)
                :
                (
                    <div className='space-y-4 w-3/4'>
                        <p className='text-3xl font-bold'>All Projects</p>
                        {projects ? <DataTable columns={Columns} data={projects} /> : null}
                    </div>
                )
            }
        </div>
    )
}

Projects.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}