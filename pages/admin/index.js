import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useCeramicContext } from '../../context';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import AdminEditTagTree from '../../components/admin/AdminEditTagTree';
import AdminCreateTag from '../../components/admin/AdminCreateTag';
import AdminQueryTag from '../../components/admin/AdminQueryTag';
import AdminQueryTagById from '../../components/admin/AdminQueryTagById';
import { Button } from "@/components/ui/button";
import AdminUpdateTag from '../../components/admin/AdminUpdateTag';
import AdminTagPack from '../../components/admin/AdminTagPack';

export default function Tags() {
    const clients = useCeramicContext();
    const { composeClient } = clients;
    const router = useRouter();
    const [changeQuery, setChangeQuery] = useState(true)
    const [changeMutation, setChangeMutation] = useState(false)
    const [tagTreeData, setTagTreeData] = useState([])
    const [tagPackData, setTagPackData] = useState([])
    const [showCircles, setShowCircles] = useState(false)

    const GET_TAG_TREE = gql`
    query getTagTree {
        idealiteTagIndex(filters: {where: {name: {equalTo: "root"}}}, first: 10) {
          edges {
            node {
              tagTree
            }
          }
        }
      }
    `

    const { loading, error, data: data } = useQuery(GET_TAG_TREE);

    if (data?.idealiteTagIndex?.edges > 0) {
        setTagTreeData(data.idealiteTagIndex.edges)
    }

    useEffect(() => {
        if (composeClient.id && !composeClient.id.includes('0x399848148c887fc42b91ac0918a2d8050a211201')) {
            router.push('/home');
        }
    }, []);


    return (
        <div>
            <div className='flex justify-start h-screen w-full'>
                <AdminEditTagTree
                    tagTreeData={tagTreeData}
                    setTagTreeData={setTagTreeData}
                    setTagPackData={setTagPackData}
                />
                <div>
                    <Button variant='secondary' onClick={() => setChangeMutation(!changeMutation)}>Change Mutation</Button>
                    {changeMutation ?
                        <AdminUpdateTag />
                        :
                        <AdminCreateTag />
                    }
                </div>
                <div>
                    <Button variant='secondary' onClick={() => setChangeQuery(!changeQuery)}>
                        {changeQuery ? 'Query All Tags' : 'Query By Id'}
                    </Button>
                    {changeQuery ?
                        <AdminQueryTag tagTreeData={tagTreeData} setTagTreeData={setTagTreeData} />
                        :
                        <AdminQueryTagById />
                    }
                </div>
                <div>
                    <Button variant='secondary' onClick={() => setShowCircles(!showCircles)}>Show Circles</Button>
                    {showCircles ?
                        <AdminTagPack tagPackData={tagPackData} width={800} height={800} />
                        :
                        null
                    }
                </div>

            </div>
            <div className='h-screen'>
            </div>
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