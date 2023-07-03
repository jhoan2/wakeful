import '../styles/globals.css'

import { CeramicWrapper } from "../context";

import React, { useState, useEffect } from "react"

import { useCeramicContext } from '../context';
import { authenticateCeramic } from '../utils';
import AuthPrompt from "./did-select-popup";


const MyApp = ({ Component, pageProps }) => {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [profile, setProfile] = useState()

  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient)
    await getProfile()
  }

  const getProfile = async () => {
    console.log(ceramic.did)
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery(`
        query {
          viewer {
            id
            basicProfile {
              id
              name
              username
            }
          }
        }
      `);
      localStorage.setItem("viewer", profile?.data?.viewer?.id)

      setProfile(profile?.data?.viewer?.basicProfile)
    }
  }
  // Update to include refresh on auth
  useEffect(() => {
    if (localStorage.getItem('logged_in')) {
      handleLogin()
      getProfile()
    }
  }, [])

  return (
    <div> <AuthPrompt />
      <div className="container">
        <CeramicWrapper>
          <div className="body">
            <Component {...pageProps} ceramic />
          </div>
        </CeramicWrapper>
      </div>
    </div>
  );
}

export default MyApp