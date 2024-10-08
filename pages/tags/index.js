import React, { useState, useEffect } from 'react';
import TagPack from '../../components/tags/TagPack';
import Layout from '../../components/Layout';
import { gql, useQuery } from '@apollo/client';
import { toast } from 'sonner';

export default function Tags() {
    const [exploreTags, setExploreTags] = useState('')
    //Calculates the width and height to the hundreds place of the window innerHeight for the size of the tag pack circles. 
    let width, height

    if (typeof window !== "undefined") {
        width = Math.floor(window.innerHeight / 100) * 100;
        height = Math.floor(window.innerHeight / 100) * 100;
    }

    const GET_TAG_TREE_FROM_ROOT = gql`
    query getTagTreeFromRoot {
        idealiteTagv1Index(filters: {where: {name: {equalTo: "root"}}}, first: 10) {
          edges {
            node {
              tagTree
            }
          }
        }
      }
    `

    const { loading: exploreTagsLoading, error: exploreTagsError, data: exploreTagsData } = useQuery(GET_TAG_TREE_FROM_ROOT, {
        onCompleted: () => setExploreTags(exploreTagsData)
    });

    if (exploreTagsLoading) {
        return (
            <div className='flex h-screen justify-center items-center'>
                <p>Loading...</p>
            </div>
        )
    }

    if (exploreTagsError) {
        toast.error('Something went wrong loading explore tags')
        console.log('Error: ' + exploreTagsError.message)
    }




    return (
        <div className='flex h-screen justify-center items-center'>
            <TagPack width={width} height={height} exploreTags={exploreTags} />
        </div>
    )
}

Tags.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}