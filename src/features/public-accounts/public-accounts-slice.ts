/// User account data
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {OptionalString} from '../../common/types'

export interface AccountsQueryResults {
    accounts: Array<string>,
    total: number,
    last_name: OptionalString, // last query name
}

export interface AccountsState {
    accounts: Array<string> // list of results of last query for account by name or publicly listed accounts
    name_availability: OptionalNameAvailable
    totalAccounts: number,
    from: OptionalString
}

// export type OptionalAccountsState = AccountsState | null
export type OptionalNameAvailable = { name: string, available: boolean } | null

export const initialAccountsState : AccountsState = {
    accounts: new Array<string>(),
    name_availability: null,
    totalAccounts: 0,
    from: null,
}

// set init state from store if possible
function getInitialState() : AccountsState {
    return Object.assign({}, initialAccountsState)
}

const publicAccountsSlice = createSlice({
    name: 'public-accounts',
    initialState: getInitialState(),
    reducers: {
        setAccounts(state, action: PayloadAction<Array<string>>) {
            state.accounts = action.payload
        },
        setNameAvailability(state, action: PayloadAction<OptionalNameAvailable>) {
            state.name_availability = action.payload
        },
        addAccounts(state, action: PayloadAction<AccountsQueryResults>) {
            state.from = action.payload.last_name
            state.totalAccounts = action.payload.total

            // todo: add support for not adding duplicated accounts (results from previous view of directory)
            for (const a of action.payload.accounts) {
                state.accounts.push(a)
            }
        }
    }
})

export const { setAccounts, addAccounts, setNameAvailability } = publicAccountsSlice.actions
export default publicAccountsSlice.reducer
