import React, { createContext, useContext, useState, useEffect } from "react";
import { CeramicClient } from "@ceramicnetwork/http-client"
import { ComposeClient } from "@composedb/client";

import { definition } from "../src/__generated__/definition.js";
import { RuntimeCompositeDefinition } from "@composedb/types";
import { useWalletClient } from "wagmi";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DIDSession } from "did-session";
import { type GetWalletClientResult } from "@wagmi/core";
import { type DID } from "dids";

/**
 * Configure ceramic Client & create context.
 */
const ceramic = new CeramicClient(`${process.env.NEXT_PUBLIC_CERAMIC_URL}`);

const composeClient = new ComposeClient({
  ceramic: `${process.env.NEXT_PUBLIC_CERAMIC_URL}`,
  // cast our definition as a RuntimeCompositeDefinition
  definition: definition as RuntimeCompositeDefinition,
});

const CeramicContext = createContext({ ceramic: ceramic, composeClient: composeClient });
const ProfileContext = createContext({});

export const CeramicWrapper = ({ children }: any) => {
  const [profile, setProfile] = useState({
    id: '',
    displayName: '',
    bio: '',
    favorites: [],
    tags: [],
    farcasterId: ''
  })

  const updateTagTree = (newTag: any) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      tags: newTag
    }));
  };

  const updateProfileBioAndName = (newBio: any, newDisplayName: any) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      bio: newBio,
      displayName: newDisplayName,
    }));
  };

  const setCreatedProfile = (id: any, newBio: any, newDisplayName: any, farcasterId: any, avatarCid: any) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      id: id,
      bio: newBio,
      displayName: newDisplayName,
      farcasterId: farcasterId,
      avatarCid: avatarCid
    }));
  };

  let isAuthenticated = false;

  function StartAuth() {
    const { data: walletClient } = useWalletClient();
    const [isAuth, setAuth] = useState(false);

    useEffect(() => {
      async function authenticate(
        walletClient: GetWalletClientResult | undefined,
      ) {
        if (walletClient) {
          const accountId = await getAccountId(
            walletClient,
            walletClient.account.address,
          );
          const authMethod = await EthereumWebAuth.getAuthMethod(
            walletClient,
            accountId,
          );
          const oneDay = 60 * 60 * 1
          const session = await DIDSession.get(accountId, authMethod, {
            resources: composeClient.resources,
            expiresInSecs: oneDay
          });

          await ceramic.setDID(session.did as unknown as DID);
          composeClient.setDID(session.did as unknown as DID);
          localStorage.setItem("did", session.did.parent);
          setAuth(true);
        }
      }
      void authenticate(walletClient);
    }, [walletClient]);

    return isAuth;
  }

  if (!isAuthenticated) {
    isAuthenticated = StartAuth();
  }


  return (
    <CeramicContext.Provider value={{ ceramic, composeClient }}>
      <ProfileContext.Provider value={{ profile, setProfile, updateTagTree, updateProfileBioAndName, setCreatedProfile }}>
        {children}
      </ProfileContext.Provider>
    </CeramicContext.Provider>
  );
};

/**
 * Provide access to the Ceramic & Compose clients.
 * @example const { ceramic, compose } = useCeramicContext()
 * @returns CeramicClient
 */

export const useCeramicContext = () => useContext(CeramicContext);
export const useProfileContext = () => useContext(ProfileContext);