import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { reconnect } from '@wagmi/core'
import { sepolia, mainnet } from '@wagmi/core/chains'

export const projectId = 'a2b392649ab49d473ca531f98ed09ae0'

export const metadata = {
  name: 'Langle',
  description: 'Decentralized Auction Platform',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = defaultWagmiConfig({
  chains: [sepolia, mainnet],
  projectId,
  metadata
})

export const web3ModalConfig = {
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
}

export const connectToWeb3Modal = () => {
  reconnect(config)

  createWeb3Modal(web3ModalConfig)
}
