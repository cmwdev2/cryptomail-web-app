// load the account state and return it if it was read from local store. return null on error.
import {LocalAccountState, OptionalAccountState} from '../account/account-slice'

const ACCOUNT_STORE_KEY = `account`
const RUNTIME_SETTINGS = 'runtime_settings'

interface RuntimeSettings {
    background_idx: number
}

export function readAccountStateFromLocalStore() : OptionalAccountState {
    try {
        const state = localStorage.getItem(ACCOUNT_STORE_KEY)
        if (state === null) {
            console.log('no account state in local store')
            return null
        }
        console.log("💾 loading persisted account state from local store...")
        return JSON.parse(state)
    } catch (err) {
        console.log('error trying to read account state from local store', err)
        return null
    }
}

// save the account state to local store
export function saveAccountStateToLocalStore(state: LocalAccountState) {
    try {
        console.log("💾 saving account state to local store...")
        const serializedState = JSON.stringify(state)
        localStorage.setItem(ACCOUNT_STORE_KEY, serializedState)
    } catch {
        console.log('error persisting account to local store')
    }
}

///////

export function getRuntimeSettingsFromStore() : RuntimeSettings {
    try {
        const data = localStorage.getItem(RUNTIME_SETTINGS)
        if (data === null) {
            return { background_idx: 0}
        }
        return JSON.parse(data)
    } catch (err) {
        console.log('error trying to read bcg index from tore', err)
        return { background_idx: 0}
    }
}

// save the account state to local store
export function saveRuntimeSettingsToStore(data: RuntimeSettings) {
    try {
        console.log("💾 saving account state to local store...")
        const serializedState = JSON.stringify(data)
        localStorage.setItem(RUNTIME_SETTINGS, serializedState)
    } catch {
        console.log('error persisting account to local store')
    }
}
