/// User account data
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    OptionalString
} from '../../common/types'
import {readAccountStateFromLocalStore, saveAccountStateToLocalStore} from '../local-store/local-store'

// stored_seed knows how to generate random numbers with indexes (derived keys)
// use TweetNaCl to create ed25519 private keys from this random input

// all hex strings are not 0x prefixed as a convention.

// user is logged in if seed is not empty. Seed is decoded from (stored_seed, password)
// export const isLoggedIn : boolean = useAppSelector((state) => state.seed.length() === 0)

// user can only log in if he has stored seed that may be decrypted with password
// export const canLogIn : boolean = useAppSelector((state) => state.stored_seed.length() > 0)

// when user is logged out, everything besides stored seed is cleared from storage.
// when user starts app after being logged in. All data is loaded from store.

// todo: add another thread-boxes slice to handle account threadboxes - it is updated when account is loaded / unloaded

// protobuff objets such as Account and PublicAccountInfo are stored as in state base64 encoded string of their serialized data or null when no data is known

export interface LocalAccountState {
    enc_seed: OptionalString, // user private seed encrypted with user password - used to derive entropy for new ed25519 keys such as login key and pre-keys
    enc_outgoing_messages_keys: OptionalString // base64 encrypted outgoing messages keys (MessageKeys obj) with account enc key
    seed: OptionalString, // user seed (decrypted). Loaded from local store on app startup. Set to null if user logs out. Hex string. 16 bytes of data. 32 chars long.
    account: OptionalString, // base64 buff of user account binary. Loaded from local store on new session. Return from server on  Set to null on sign-out.
    key_pair: OptionalString // base64 buff of binary when signed in - Ed22519 key pair for account. Null otherwise. Saved in local store
    name: OptionalString // last signed-in user account name for display
    keep_signed_in: boolean // when true, user specified to keep being signed in on computer. when sign-out we should not delete enc-seed
}

export type OptionalAccountState = LocalAccountState | null

export const initialState : LocalAccountState = {
    enc_seed: null,
    enc_outgoing_messages_keys: null,
    seed: null,
    account: null,
    key_pair: null,
    name: null,
    keep_signed_in: true,
}

// set init state from store if possible
function getInitialState() : LocalAccountState {
    // on new app session we read account state from local store
    const state = readAccountStateFromLocalStore()
    if (state !== null) {
        return state
    } else {
        return Object.assign({}, initialState)
    }
}

const accountSlice = createSlice({
    name: 'account',
    initialState: getInitialState(),
    reducers: {
        bulkUpdate(state, action: PayloadAction<LocalAccountState>) { // load state from action state
            console.log("setting account in redux state via bulk update...")
            state.seed = action.payload.seed
            state.account = action.payload.account
            state.key_pair = action.payload.key_pair
            state.enc_seed = action.payload.enc_seed
            state.name = action.payload.name
            state.keep_signed_in = action.payload.keep_signed_in
            state.enc_outgoing_messages_keys = action.payload.enc_outgoing_messages_keys
            saveAccountStateToLocalStore(state)
        },
        clearAccountItems(state) { // clear all account state besides enc_seed and name
            state.seed = null
            state.account = null
            state.key_pair = null
            state.enc_outgoing_messages_keys = null
            saveAccountStateToLocalStore(state)
        },
        setEncryptedSeed(state, action: PayloadAction<OptionalString>) {
            state.enc_seed = action.payload
            saveAccountStateToLocalStore(state)
        },
        setSeed(state, action: PayloadAction<OptionalString>) {
            state.seed = action.payload
            saveAccountStateToLocalStore(state)
        },
        setAccount(state, action: PayloadAction<{account: OptionalString, accountName:OptionalString}>) {
            console.log("setting account in redux state...")
            state.account = action.payload.account
            state.name = action.payload.accountName
            saveAccountStateToLocalStore(state)
        },
        setKeyPair(state, action: PayloadAction<OptionalString>) {
            state.key_pair = action.payload
            saveAccountStateToLocalStore(state)
        },
        setAccountName(state, action: PayloadAction<OptionalString>) {
            state.name = action.payload
            saveAccountStateToLocalStore(state)
        },
        setKeepSignIn(state, action: PayloadAction<boolean>) {
            state.keep_signed_in = action.payload
        },
        setOutgoingMessagesKeys(state, action: PayloadAction<OptionalString>) {
            state.enc_outgoing_messages_keys = action.payload
            saveAccountStateToLocalStore(state)
        }
    }
})

export const { setOutgoingMessagesKeys, bulkUpdate, clearAccountItems, setEncryptedSeed, setSeed, setAccount, setKeyPair } = accountSlice.actions
export default accountSlice.reducer
