import '../styles/globals.css'
import { CeramicWrapper } from "../context";
import React, { useState, useEffect } from "react";
import { useCeramicContext } from '../context';
import { ApolloClient, ApolloLink, InMemoryCache, Observable, ApolloProvider } from '@apollo/client';
import { Toaster } from 'sonner';
import { relayStylePagination } from "@apollo/client/utilities";
import Layout from '../components/Layout';

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
            accountResourcesIndex: relayStylePagination(),
          },
        },
        CeramicAccount: {
          fields: {
            idealiteProjectCardCollectionList: relayStylePagination(),
          }
        },
        IdealiteResource: {
          fields: {
            cards: relayStylePagination(),
          }
        },
      },
    }), link
  })



  return getLayout(
    <div className='w-full'>
      <ApolloProvider client={apolloClient}>
        <div>
          <CeramicWrapper>
            <div>
              <Component {...pageProps} />
              <Toaster richColors />
            </div>
          </CeramicWrapper>
        </div>
      </ApolloProvider>
    </div>
  );
}

export default MyApp