import React from 'react'
import { useQuery, gql } from '@apollo/client';
import { useProfileContext } from '../../context';

export default function GetProfile() {
  const { setProfile } = useProfileContext();
  const GET_USER_PROFILE = gql`
    query getUserProfile {
        viewer {
          idealiteProfile {
            id
            bio
            displayName
            favorites {
              id
              title
            }
          }
        }
      }
    `

  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  if (data && data.viewer?.idealiteProfile) {
    setProfile(data.viewer.idealiteProfile)
  }

  return (
    <></>
  )
}
