import React, { useState } from 'react';
import Layout from '../../components/Layout';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileEdit from '../../components/profile/ProfileEdit';
import { useCeramicContext } from '../../context';
import { useProfileContext } from '../../context';

export default function Profile() {
  const [editProfile, setEditProfile] = useState(false);
  const clients = useCeramicContext();
  const { composeClient } = clients;
  const composeClientId = composeClient.id
  const avatarFallback = composeClientId ? composeClientId.substring(composeClientId.length - 5) : '0x...'
  const { profile } = useProfileContext();

  return (
    < div className='flex justify-center h-screen w-full' >
      <div className='w-2/3'>
        {
          editProfile ?
            <ProfileEdit setEditProfile={setEditProfile} avatarFallback={avatarFallback} profile={profile} />
            :
            <ProfileCard setEditProfile={setEditProfile} avatarFallback={avatarFallback} profile={profile} />
        }
      </div>
    </div >
  )
}

Profile.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}