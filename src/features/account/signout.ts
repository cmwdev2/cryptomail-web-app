import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch, RootState} from '../../app/store'
import {
    bulkUpdate,
    LocalAccountState,
    initialState
} from './account-slice'
import {resetMessages} from '../messaging/messaging-slice'

// Log out the user from the app and remove all account data
export const removeAccountData = createAsyncThunk(
    'account/logout',
    async (_, thunkAPI : AsyncThunkConfig) => {
        // clear all account related state
        const dispatch: AppDispatch = thunkAPI.dispatch!
        let accountState: LocalAccountState = Object.assign({}, initialState)
        console.log("👋 Signed out user from the app and removed all local data")
        dispatch(bulkUpdate(accountState))
    }
)
// Log out the user from the app
export const logout = createAsyncThunk(
    'account/logout',
    async (_, thunkAPI : AsyncThunkConfig) => {
        // clear all account state besides the encrypted seed
        const dispatch: AppDispatch = thunkAPI.dispatch!
        // we need to clone initial state so we don't modify it below
        let accountState: LocalAccountState = Object.assign({}, initialState)
        const state: RootState = thunkAPI.getState()

        if (state.account.keep_signed_in) {
            console.log("Keeping info to enable sign-in on this device...")
            // we only keep info that will enabler the user to sign-in again on this computer if keep_signed_in settings is tru
            accountState.enc_seed = state.account.enc_seed
            accountState.name = state.account.name
            accountState.keep_signed_in = true
            accountState.enc_outgoing_messages_keys = state.account.enc_outgoing_messages_keys
        }

        // remove all message from local store
        dispatch(resetMessages)

        dispatch(bulkUpdate(accountState))

        console.log("👋 Signed out user from the app.")

    }
)

