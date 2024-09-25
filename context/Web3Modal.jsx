import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { base } from 'viem/chains'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'b97489bf31ef71451aea1f6de4e728d1'

// 2. Create wagmiConfig
const metadata = {
    name: 'Idealite',
    description: 'A digitally native educational institution',
    url: 'https://www.idealite.xyz',
    icons: ['/icon32.png']
}


const chains = [base]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata, enableEmail: true })

// 3. Create modal
createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    defaultChain: base,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration,
})

export function Web3Modal({ children }) {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}