import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useCeramicContext } from '../../context';
import { useProfileContext } from '../../context';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileNotFound from '../../components/profile/ProfileNotFound';

export default function Profile() {
  const [hasProfile, setHasProfile] = useState(false);
  const [farcasterProfile, setFarcasterProfile] = useState(null);
  const clients = useCeramicContext();
  const { composeClient } = clients;
  const composeClientId = composeClient.id
  const avatarFallback = composeClientId ? composeClientId.substring(composeClientId.length - 5) : '0x...'
  const { profile, updateProfileBioAndName } = useProfileContext();

  useEffect(() => {
    if (profile.id) setHasProfile(true)
  }, [profile])

  if (!composeClientId) return <div className='flex justify-center h-screen w-full text-3xl pt-6'>Please connect wallet.</div>

  return (
    < div className='flex justify-center h-screen w-full' >
      {
        hasProfile ?
          <ProfileCard
            avatarFallback={avatarFallback}
            profile={profile}
            updateProfileBioAndName={updateProfileBioAndName}
            farcasterProfile={farcasterProfile}
            setFarcasterProfile={setFarcasterProfile}
          />
          :
          <ProfileNotFound
            setHasProfile={setHasProfile}
            avatarFallback={avatarFallback}
            farcasterProfile={farcasterProfile}
            setFarcasterProfile={setFarcasterProfile}
          />
      }
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