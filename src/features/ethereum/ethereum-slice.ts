import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {OptionalNumber, OptionalString} from '../../common/types'

interface EthereumState {
    account: OptionalString // ethereum address or null
    chainId: OptionalNumber // ethereum chainId or null
    signature: OptionalString // user signature on address
    usdPrice: number // 1 eth usd price estimate
}

const initialState: EthereumState = {
    account: null,
    chainId: null,
    signature: null,
    usdPrice: 0,
}

// if account is a valid address then provider can be obtained when needed by code by:
// const web3_provider = new ethers.providers.Web3Provider((window as any).ethereum)
// it should not be in redux state because it is not serializable

const ethereumSlice = createSlice({
    name: 'ethereum',
    initialState,
    reducers: {
        reset(state) {
            state.account = null
            state.chainId = null
            state.signature = null
        },
        updateAccount(state, action: PayloadAction<OptionalString>) {
            console.log("🦊 updating eth account in state: " + action.payload)
            state.account = action.payload
            state.signature = null // every time account changes we remove the signature
        },
        updateChainId(state, action: PayloadAction<OptionalNumber>) {
            console.log("⛓ updating eth chain id in state: " + action.payload)
            state.chainId = action.payload
        },
        updateSignature(state, action: PayloadAction<OptionalString>) {
            state.signature = action.payload
        },
        setUsdPriceEstimate(state, action: PayloadAction<number>) {
            state.usdPrice = action.payload
        }
    }
})

// export the actions and the reducer
export const { setUsdPriceEstimate, reset, updateChainId, updateAccount, updateSignature } = ethereumSlice.actions
export default ethereumSlice.reducer
