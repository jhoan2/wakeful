import { useEffect, useState } from 'react';
import { useCeramicContext } from '../context';

import Head from 'next/head'

import AuthPrompt from "../components/did-select-popup";
import React from "react";
import { authenticateCeramic } from "../utils";

const Home = () => {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients

  const handleLogout = () => {
    localStorage.setItem("logged_in", "false")
    localStorage.removeItem('ceramic:did_seed')
    localStorage.removeItem('ceramic:eth_did')
    localStorage.removeItem('did')
    localStorage.removeItem('ceramic:auth_type')
    console.log(localStorage.getItem('logged_in'))
    window.location.reload();
    console.log('logged out')
  }

  // useEffect(() => {
  //   getPosts()
  // }, [])

  return (
    <>
      <Head>
        <title>Ceramic Social</title>
        {/* TODO: UPDATE FAVICON */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={() => handleLogout()}>Logout</button>
    </>
  );
}

export default Home