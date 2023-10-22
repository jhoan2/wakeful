import React, { useState } from "react";
import { authenticateCeramic } from '../utils'
import { useCeramicContext } from "../context";

const AuthPrompt = () => {
  const [isVisible, setIsVisible] = useState(true);
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const isLogged = () => {
    return localStorage.getItem("logged_in") == "true"
  };

  const handleOpen = () => {
    if (localStorage.getItem("logged_in")) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleKeyDid = () => {
    localStorage.setItem("ceramic:auth_type", "key");
    // setIsVisible(false);
    authenticateCeramic(ceramic, composeClient)
  };

  const handleEthPkh = () => {
    localStorage.setItem("ceramic:auth_type", "eth");
    //commented in order to keep the buttons visible. 
    // setIsVisible(false);
    authenticateCeramic(ceramic, composeClient)
  };

  const handleLogout = () => {
    localStorage.setItem("logged_in", "false")
    localStorage.removeItem('ceramic:did_seed')
    localStorage.removeItem('ceramic:eth_did')
    localStorage.removeItem('did')
    localStorage.removeItem('ceramic:auth_type')
    console.log('logged out')

  }

  const getSeed = () => {
    console.log(sessionStorage.getItem('ceramic:did_seed'))
    console.log(localStorage.getItem('ceramic:did_seed'))

  }

  const getProfile = async () => {
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery(`
            query {
              viewer {
                id
                icarusProfile {
                  id
                  displayName
                  createdAt
                }
              }
            }
          `);
      console.log(profile)
      //the viewer id will be did:key:<public-key>
    } else {
      console.log('no ceramic did so no account')
    }
  }

  const createNewResource = async () => {

    if (ceramic.did !== undefined) {
      const resource = await composeClient.executeQuery(`
      mutation {
        createIcarusResource(
          input: {
            content: {
              author: "jhoang", 
              title: "something", 
              textContent: "created from vscode"}, 
        ) {
          document {
            title
            id
          }
        }
      }
      `)
      console.log(resource)
    } else {
      console.log('no ceramic did ')
    }
  }
  return (
    <div>
      {
        isVisible && (
          <div id='popup' className="flex">
            <div className="popup-content">
              <h2>Authenticate</h2>
              <span><button onClick={() => handleKeyDid()}>Key DID</button></span>
              <span><button onClick={() => handleEthPkh()}>Ethereum DID PKH</button></span>
              <span><button onClick={() => handleLogout()}>Log out</button></span>
              <span><button onClick={() => getProfile()}>Get Profile</button></span>
              <span><button onClick={() => getSeed()}>Get Seed</button></span>
              <span><button onClick={() => createNewResource()}>Create Resource</button></span>

            </div>
          </div>
        )}
    </div>
  );
};

export default AuthPrompt;