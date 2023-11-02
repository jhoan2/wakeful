import '../styles/globals.css'

import { CeramicWrapper } from "../context";

import React, { useState, useEffect } from "react"

import { useCeramicContext } from '../context';
import { authenticateCeramic } from '../utils';
import AuthPrompt from "../components/did-select-popup";
import { ApolloClient, ApolloLink, InMemoryCache, Observable, ApolloProvider } from '@apollo/client'


const MyApp = ({ Component, pageProps }) => {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [loggedIn, setLoggedIn] = useState(false)
  const link = new ApolloLink((operation) => {
    return new Observable((observer) => {
      composeClient.execute(operation.query, operation.variables).then(
        (result) => {
          observer.next(result)
          observer.complete()
        },
        (error) => {
          observer.error(error)
        }
      )
    })
  })

  const apolloClient = new ApolloClient({ cache: new InMemoryCache(), link })

  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient)
  }

  // Update to include refresh on auth
  useEffect(() => {
    if (localStorage.getItem('logged_in' === true)) {
      handleLogin()
    }

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    const popup = document.getElementById('popup')
    if (popup.style.display === "none") {
      //change the logo here
      setLoggedIn(true)
    }
  }, [])

  return (
    <div>
      <AuthPrompt />
      <ApolloProvider client={apolloClient}>
        <div>
          <CeramicWrapper>
            <div>
              <Component {...pageProps} loggedIn={loggedIn} />
            </div>
          </CeramicWrapper>
        </div>
      </ApolloProvider>
    </div>
  );
}

export default MyApp