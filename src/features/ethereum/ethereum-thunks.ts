import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import detectEthereumProvider from '@metamask/detect-provider'
import {reset, updateSignature} from './ethereum-slice'
import {setLastError} from '../app/app-slice'
import {grpc} from '@improbable-eng/grpc-web'
import {ethers} from 'ethers'

// Ethereum thunks
// Thunks are async or sync functions that:
// (1) callable via dispatch
// (2) can read redux state
// (3) dispatch redux actions to modify state or call other thunks via dispatch
// (4) can execute arbitrary coed

// A callback from ethereum provider when chainId changes
type ChainIdChangedCallback = (chainId: string) => void

// A callback from ethereum provider when unlocked account changed
type AccountChangedCallback = (account: string[]) => void

type EthCallback = {
    chainChanged: ChainIdChangedCallback,
    accountChanged: AccountChangedCallback,
}

export type SignMessageParams = {
    ethAccount: string, // 0x... format
    message: string // arbitrary message
}

// Sign a message with the current eth provider
export const signMessage = createAsyncThunk(
    'ethereum/sign-message',
    async (params: SignMessageParams, thunkAPI : AsyncThunkConfig) => {
        const dispatch = thunkAPI.dispatch!

        if (typeof window.ethereum === 'undefined') {
            console.log("Metamask provider not available")
            return
        }

        // double check metamask is the source of window.ethereum
        const metamask_provider = await detectEthereumProvider()
        if (!metamask_provider) {
            return
        }

        if (params.ethAccount.substring(0,2) !== "0x") {
            console.log("need valid eth account - please connect metamask")
            return
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum as any)
        const signer = provider.getSigner()

        const message = params.message + params.ethAccount
        const signature: string = await signer.signMessage(message)
        console.log("✍️ eth signature: " + signature)
        dispatch(updateSignature(signature))
    }
)

export const initEthereum = createAsyncThunk(
    'ethereum/init',
    async (callbacks: EthCallback, thunkAPI : AsyncThunkConfig) => {
        const dispatch = thunkAPI.dispatch!

        const metamask_provider = await detectEthereumProvider()
        if (!metamask_provider) {
            console.log("ethereum provider not available")
            dispatch(reset())
            return
        }

        if (metamask_provider !== window.ethereum) {
            console.log("another wallet is over-riding window.ethereum from metamask")
            dispatch(reset())
            return
        }

        if (typeof window.ethereum === 'undefined') {
            console.log("unexpected windows.ethereum missing")
            dispatch(reset())
            return
        }

        await (window as any).ethereum.request({ method: 'eth_accounts' })
            .then(callbacks.accountChanged)
            .catch((err: any) => {
                console.log("Some unexpected error. For backwards compatibility reasons, if no accounts are available, eth_accounts will return an empty array." + err)
                dispatch(reset())
            })

        // Note that this event can be emitted on page load if metamask was approved by user for this app.
        // If the array of accounts is non-empty, user is already connected.
        await (window as any).ethereum.on('accountsChanged', callbacks.accountChanged)

        const chainId: string = await (window as any).ethereum.request({ method: 'eth_chainId' })
        callbacks.chainChanged(chainId)

        await (window as any).ethereum.on('chainChanged', callbacks.accountChanged)
    }
)

// User requests to connect to browser ethereum provider
export const connectEthereum = createAsyncThunk(
    'ethereum/connect',
    async (callbacks: EthCallback, thunkAPI : AsyncThunkConfig) => {
        console.log("connectEthereum...")
        const dispatch = thunkAPI.dispatch!
        dispatch(setLastError(null))

        if (typeof window.ethereum === 'undefined') {
            console.log("no injected provider - reset ethereum state")
            dispatch(reset())
            dispatch(setLastError({
                message: "Metamask browser extension is not available",
                reason: "Please enable it and try again",
                code: grpc.Code.Unavailable
            }))
            return
        }

        (window as any).ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(callbacks.accountChanged)
            .catch((err: { code: number }) => {
                if (err.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    // If this happens, the user rejected the connection request.
                    // console.log('Request account error: please connect to metamask.')
                    dispatch(setLastError({
                        message: "Metamask rejected your connection request",
                        reason: "Please try again and accept the connection request in metamask",
                        code: grpc.Code.Unauthenticated
                    }))
                } else {
                    console.error("request account error: " + err)
                    dispatch(setLastError({
                        message: "Metamask Error",
                        reason: "<provide good help text here>",
                        code: grpc.Code.Unauthenticated
                    }))
                }
            })
    }
)
