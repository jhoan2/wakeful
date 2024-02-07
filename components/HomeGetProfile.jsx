import React, { useEffect } from 'react';
import { gql, useMutation, useLazyQuery } from '@apollo/client';

export default function HomeGetProfile() {
    const GET_USER_PROFILE = gql`
      query getUserProfile {
          viewer {
            idealiteProfile {
              id
            }
          }
        }
      `

    const [getUserProfile, { data }] = useLazyQuery(GET_USER_PROFILE);

    const CREATE_IDEALITE_PROFILE = gql`
    mutation createIdealiteProfile {
        createIdealiteProfile(input: {content: {createdAt: "${new Date().toISOString()}", updatedAt: "${new Date().toISOString()}"}}) {
          document {
            id
          }
        }
      }
    `
    const [createIdealiteProfile] = useMutation(CREATE_IDEALITE_PROFILE);

    useEffect(() => {
        getUserProfile();
    }, []);

    useEffect(() => {
        if (data && data.viewer?.idealiteProfile === null) {
            createIdealiteProfile();
        }
    }, [data]);

    return (
        <></>
    )
}
