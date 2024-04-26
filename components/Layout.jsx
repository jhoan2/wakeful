import React, { useState, useEffect, } from 'react';
import Sidebar from './SideBar';
import BottomNavBar from './BottomNavBar';
import { useCeramicContext } from '../context';
import { useProfileContext } from '../context';
import { useRouter } from 'next/router';
import posthog from 'posthog-js'
import { useWalletClient } from "wagmi";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DIDSession } from "did-session";
import { useAccount } from "wagmi";
import { UserRound } from 'lucide-react';

export default function Layout({ children }) {
    const [page, setPage] = useState('home')
    const clients = useCeramicContext();
    const { profile } = useProfileContext();
    const { ceramic, composeClient } = clients;
    const composeClientId = composeClient.id
    const avatarFallback = <UserRound />
    const router = useRouter()
    let isAuthenticated = false
    const { address } = useAccount();

    useEffect(() => {
        if (!address) {
            localStorage.removeItem("did");
        }
    }, [address]);

    // useEffect(() => {

    //     // Track page views
    //     const handleRouteChange = () => posthog?.capture('$pageview')
    //     router.events.on('routeChangeComplete', handleRouteChange)

    //     return () => {
    //         router.events.off('routeChangeComplete', handleRouteChange)
    //     }
    // }, [])

    function StartAuth() {
        const { data: walletClient } = useWalletClient();
        const [isAuth, setAuth] = useState(false);

        useEffect(() => {
            async function authenticate(
                walletClient,
            ) {
                if (walletClient) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const accountId = await getAccountId(
                        walletClient,
                        walletClient.account.address,
                    );
                    const authMethod = await EthereumWebAuth.getAuthMethod(
                        walletClient,
                        accountId,
                    );
                    // change to use specific resource
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const session = await DIDSession.get(accountId, authMethod, {
                        resources: composeClient.resources,
                    });

                    await ceramic.setDID(session.did);
                    console.log("Auth'd:", session.did.parent);
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
        <div className='flex'>
            <div>
                <Sidebar page={page} setPage={setPage} avatarFallback={avatarFallback} isAuthenticated={isAuthenticated} />
            </div>
            <main className='flex justify-center w-full'>
                {children}
            </main>
            <BottomNavBar page={page} setPage={setPage} avatarFallback={avatarFallback} />
        </div>
    )
}
