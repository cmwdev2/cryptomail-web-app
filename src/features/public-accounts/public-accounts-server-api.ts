import {AppDispatch} from '../../app/store'
import {grpc} from '@improbable-eng/grpc-web'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {api_url} from '../../common/config'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {setLastError} from '../app/app-slice'
import {AsyncThunkConfig, OptionalString} from '../../common/types'
import {
    GetAccountRequest,
    GetAccountResponse,
    GetPublicAccountsRequest,
    GetPublicAccountsResponse
} from '../../proto/api/api_types_pb'
import {base64} from 'ethers/lib/utils'
import {addAccounts, setAccounts, setNameAvailability} from './public-accounts-slice'
import {Account} from '../../proto/types/accounts_pb'

// get an account by name or by address and store results in public accounts state
// sets last error if account not found
export const getPublicAccountInfoAction = createAsyncThunk(
'public-accounts/get-public-account',
async (req: GetAccountRequest, thunkAPI : AsyncThunkConfig) => {
    const dispatch: AppDispatch = thunkAPI.dispatch!
    dispatch(setLastError(null))
    grpc.unary(CryptomailApiService.GetAccount, {
        request: req,
        host: api_url,
        onEnd: (output: grpc.UnaryOutput<GetAccountResponse>) => {
            if (output.status !== grpc.Code.OK ) {
                dispatch(setLastError({
                    message: "Cmail server is unavailable",
                    reason: output.statusMessage, // technical error
                    code: output.status
                }))
                return
            }

            const res = output.message!.getAccount()
            const account: OptionalString = (!res) ? null :
                base64.encode((res as Account).serializeBinary())

            if (account) {
                const accounts = new Array<string>()
                accounts.push(account)
                console.log("updating account in public accounts state from server...")
                dispatch(setAccounts(accounts))
            } else { // no account with this name or pub key
                dispatch(setAccounts(new Array<string>()))
                dispatch(setLastError({
                    message: "There is no account named " + req.getName(),
                    reason: "", // technical error
                    code: grpc.Code.NotFound
                }))
            }
        }
    })
})

// Get all public accounts from server with optional pagination support
export const getPublicAccounts = createAsyncThunk(
'public-accounts/get-public-accounts',
async (req: GetPublicAccountsRequest, thunkAPI : AsyncThunkConfig) => {
    const dispatch: AppDispatch = thunkAPI.dispatch!
    dispatch(setLastError(null))
    grpc.unary(CryptomailApiService.GetPublicAccounts, {
        request: req,
        host: api_url,
        onEnd: (output: grpc.UnaryOutput<GetPublicAccountsResponse>) => {
            if (output.status !== grpc.Code.OK ) {
                dispatch(setLastError({
                    message: "Cmail server is unavailable",
                    reason: output.statusMessage, // technical error
                    code: output.status
                }))
            } else {
                const accounts = output.message!.getAccountsList()
                const total = output.message!.getTotal()

                console.log("total returned from server: " + total)

                const arrAccounts = new Array<string> ()
                let lastName = ""
                accounts.forEach((a: Account,i: number) => {
                    arrAccounts.push( base64.encode(a.serializeBinary()))
                    if (i === accounts.length - 1) {
                        lastName = a.getPublicAccountInfo()!.getName()
                    }
                })

                dispatch(addAccounts({
                    accounts: arrAccounts,
                    total: total,
                    last_name: lastName
                }))
            }
        }
    })
})

// Will set an error if name is already taken. Clients should assume names are available is server didn't return an error
// or raised an account taken by name error after calling this.
export const checkAccountNameAvailability = createAsyncThunk(
'public-accounts/check-account-name',
async (req: GetAccountRequest, thunkAPI : AsyncThunkConfig) => {
    const dispatch: AppDispatch = thunkAPI.dispatch!
    dispatch(setLastError(null))
    grpc.unary(CryptomailApiService.GetAccount, {
        request: req,
        host: api_url,
        onEnd: (output: grpc.UnaryOutput<GetAccountResponse>) => {
            if (output.status === grpc.Code.OK) {
                console.log("checkAccountNameAvailability: got result from server...")
                const isAvailable = (!output.message!.getAccount() || !output.message!.getAccount()!.getPublicAccountInfo())
                dispatch(setNameAvailability({name: req.getName(), available: isAvailable}))
            } else {
                dispatch(setLastError({
                    message: "Server error",
                    reason: output.statusMessage,
                    code: output.status
                }))
            }
        }
    })
})

