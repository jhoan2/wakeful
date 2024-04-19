import React from 'react'
import { useQuery, gql } from '@apollo/client';
import { useProfileContext } from '../../context';

export default function GetProfile() {
  const { setProfile } = useProfileContext();
  const GET_USER_PROFILE = gql`
    query getUserProfile {
        viewer {
          id
          idealiteProfile {
            id
            bio
            displayName
            favorites {
              id
              title
            }
            tags
          }
        }
      }
    `
  const updateProfile = (data) => {
    const shallowCopy = Object.assign({}, data.viewer.idealiteProfile)
    if (data?.viewer.idealiteProfile.tags) {
      shallowCopy.tags = JSON.parse(shallowCopy.tags)
    }

    if (data?.viewer.idealiteProfile.favorites === null) {
      shallowCopy.favorites = []
    }
    setProfile(shallowCopy)
  }

  const { error: getUserProfileError } = useQuery(GET_USER_PROFILE, {
    onCompleted: (data) => {
      if (!data.viewer.idealiteProfile) return
      updateProfile(data)
    }
  });

  if (getUserProfileError) {
    console.log('Error: ' + getUserProfileError.message)
  }

  return (
    <></>
  )
}
