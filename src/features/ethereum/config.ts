// Ethereum related config params per Ethereum network

export interface EthNetConfig {
  contractAddress: string
}

// return smart contract address for a network
export default function getNetConfig(netId: number) : EthNetConfig {
  switch (netId) {
    case 1: // Mainnet
      return { contractAddress: "0x2a0167070ebADd0761f782b461D2e6c172993d67"}
    case 3: // Ropsten testnet
      return { contractAddress: "0x2a0167070ebADd0761f782b461D2e6c172993d67"}
    case 42 :  // Kovan testnet
      return { contractAddress: "0x26f6104F1a81fA6D6Cd9D947C6753F67927d568a"}
    case 1337:  // Ganache local devnet
      return { contractAddress: "0xBF3c7C482b8F93CAcBd7C49A50838216969CDAA2"}
    default:
      throw new Error('unsupported network id')
  }
}

export enum EthTransactionStatus {
  unspecified = 0,
  submitted = 1,
  confirmed = 2,
  userRejected = 3,
  error = 4
}
