import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {grpc} from '@improbable-eng/grpc-web'

export type AppErrorCode = grpc.Code // for now we reuse grpc-web client error codes

export interface AppError {
    message: string,
    reason: string,
    code: AppErrorCode
}

export type OptionalAppError = AppError | null

interface AppState {
    loading: boolean, // a long operation is in progress
    last_error: OptionalAppError, // last app error or null when error is cleared (user closed notification)
}

const initialState: AppState = {
    loading: false,
    last_error: null
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            // the action type defines what is the action payload type... can be anything...
            state.loading = action.payload
        },
        setLastError(state, action: PayloadAction<OptionalAppError>) {
            // the action type defines what is the action payload type... can be anything...
            state.last_error = action.payload
            state.loading = false
        },
    }
})

// export the action
export const { setLastError, setLoading } = appSlice.actions

// user is logged in if seed is not empty. Seed is decoded from (stored_seed, password)
// export const isLoggedIn : boolean = useAppSelector((state) => state.seed.length() === 0)

// user can only log in if he has stored seed that may be decrypted with password
// export const canLogIn : boolean = useAppSelector((state) => state.stored_seed.length() > 0)

export default appSlice.reducer
