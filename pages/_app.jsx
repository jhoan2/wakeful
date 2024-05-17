import '../styles/globals.css'
import { CeramicWrapper } from "../context";
import React, { useEffect } from "react";
import { useCeramicContext } from '../context';
import { ApolloClient, ApolloLink, InMemoryCache, Observable, ApolloProvider } from '@apollo/client';
import { Toaster } from 'sonner';
import { relayStylePagination } from "@apollo/client/utilities";
import Head from 'next/head';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { Web3Modal } from '../context/Web3Modal';

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}


const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page)
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
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

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            idealiteAccountResourcesIndex: relayStylePagination(),
          },
        },
        CeramicAccount: {
          fields: {
            idealiteProjectCardCollectionList: relayStylePagination(),
          }
        },
        IdealiteResourcev2: {
          fields: {
            idealiteCards: relayStylePagination(),
          }
        },
      },
    }), link
  })

  return (
    <div className='w-full'>
      <Head>
        <title>Idealite</title>
        <link rel="icon" href="/icon16.png" sizes="any" type="image/png" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <div>
          <Web3Modal>
            <CeramicWrapper>
              <div>
                <PostHogProvider client={posthog}>
                  {getLayout(<Component {...pageProps} />)}
                </PostHogProvider>
                <Toaster richColors />
              </div>
            </CeramicWrapper>
          </Web3Modal>
        </div>
      </ApolloProvider>
    </div>
  )

}

export default MyApp