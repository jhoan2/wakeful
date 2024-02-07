import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileEdit from '../../components/profile/ProfileEdit';
import { useCeramicContext } from '../../context';
import { gql, useQuery } from '@apollo/client';
import ProfileSkeleton from '../../components/profile/ProfileSkeleton';
import ErrorPage from '../../components/ErrorPage';
export default function Profile() {
    const [editProfile, setEditProfile] = useState(false);
    const clients = useCeramicContext();
    const { composeClient } = clients;
    const composeClientId = composeClient.id
    const avatarFallback = composeClientId ? composeClientId.substring(composeClientId.length - 5) : '0x...'
    const GET_USER_PROFILE = gql`
      query getUserProfile {
          viewer {
            idealiteProfile {
              id
              bio
              displayName
            }
          }
        }
      `

    const { loading, error, data } = useQuery(GET_USER_PROFILE);
    const userProfile = data?.viewer?.idealiteProfile
    if (loading) return <div className='flex justify-center h-screen'><ProfileSkeleton /></div>
    if (error) return <ErrorPage message={"Error loading profile"} />;
    return (
        <div className='flex justify-center h-screen'>
            {editProfile ?
                <ProfileEdit setEditProfile={setEditProfile} avatarFallback={avatarFallback} userProfile={userProfile} /> :
                <ProfileCard setEditProfile={setEditProfile} avatarFallback={avatarFallback} userProfile={userProfile} />
            }
        </div>
    )
}

Profile.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}