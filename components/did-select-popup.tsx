import React, { useState } from "react";
import { authenticateCeramic } from '../utils'
import { useCeramicContext } from "../context";
import { useRouter } from "next/router";
const AuthPrompt = () => {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const router = useRouter();

  const handleKeyDid = () => {
    localStorage.setItem("ceramic:auth_type", "key");
    // authenticateCeramic(ceramic, composeClient)
  };

  const handleEthPkh = async () => {
    localStorage.setItem("ceramic:auth_type", "eth");
    await authenticateCeramic(ceramic, composeClient)
    if (localStorage.getItem("logged_in") === 'true') {
      window.location.reload()
    }
  };


  return (
    <button type="button" title='Wallet Connect' onClick={() => handleEthPkh()} className="hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 bg-amber-400 hover:bg-gray-600 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 animate-bounce">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.0049 7H23.0049V17H22.0049V20C22.0049 20.5523 21.5572 21 21.0049 21H3.00488C2.4526 21 2.00488 20.5523 2.00488 20V4C2.00488 3.44772 2.4526 3 3.00488 3H21.0049C21.5572 3 22.0049 3.44772 22.0049 4V7ZM20.0049 17H14.0049C11.2435 17 9.00488 14.7614 9.00488 12C9.00488 9.23858 11.2435 7 14.0049 7H20.0049V5H4.00488V19H20.0049V17ZM21.0049 15V9H14.0049C12.348 9 11.0049 10.3431 11.0049 12C11.0049 13.6569 12.348 15 14.0049 15H21.0049ZM14.0049 11H17.0049V13H14.0049V11Z"></path></svg>
    </button>
  );
};

export default AuthPrompt;