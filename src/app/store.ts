import { configureStore, combineReducers } from '@reduxjs/toolkit'
import accountReducer from '../features/account/account-slice'
import ethereumReducer from '../features/ethereum/ethereum-slice'
import publicAccountsReducer from '../features/public-accounts/public-accounts-slice'
import messageReducer from '../features/messaging/messaging-slice'

import appReducer from '../features/app/app-slice'
// import logger from 'redux-logger'

export const store = configureStore({
    reducer: combineReducers({
        ethereum: ethereumReducer,
        account: accountReducer,
        pub_accounts: publicAccountsReducer,
        app: appReducer,
        messages: messageReducer,
    }),
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware()
            //.concat(logger) // add logger when it is needed
    }
})

// exporting type of dispatch
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

// verify if / why this is needed:
export default store

export function getRootState () : RootState {
    return store.getState() as RootState
}

