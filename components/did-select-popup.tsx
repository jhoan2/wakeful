import React from "react";
// import { authenticateCeramic } from '../utils'
import { useCeramicContext } from "../context";
import { useRouter } from "next/router";
const AuthPrompt = () => {
  const clients = useCeramicContext()
  const router = useRouter()
  const { ceramic, composeClient } = clients

  const handleKeyDid = () => {
    localStorage.setItem("ceramic:auth_type", "key");
    // authenticateCeramic(ceramic, composeClient)
  };

  // const handleEthPkh = async () => {
  //   localStorage.setItem("ceramic:auth_type", "eth");
  //   await authenticateCeramic(ceramic, composeClient).then(() => {
  //     // window.location.reload()
  //     router.push('/home')
  //   })
  // };


  // return (
  //   // <button type="button" title='Wallet Connect' onClick={() => handleEthPkh()} className="hs-tooltip-toggle w-16 h-16 inline-flex justify-center items-center gap-x-2 text-md text-black font-semibold rounded-full border border-transparent bg-amber-400 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 animate-bounce">
  //   //   Login
  //   // </button>
  // );
};

export default AuthPrompt;