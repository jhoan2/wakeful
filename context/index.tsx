import React, { createContext, useContext, useState } from "react";
import { CeramicClient } from "@ceramicnetwork/http-client"
import { ComposeClient } from "@composedb/client";

import { definition } from "../src/__generated__/definition.js";
import { RuntimeCompositeDefinition } from "@composedb/types";

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
    tags: []
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
      displayName: newDisplayName
    }));
  };

  const setCreatedProfile = (id: any, newBio: any, newDisplayName: any) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      id: id,
      bio: newBio,
      displayName: newDisplayName
    }));
  };

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