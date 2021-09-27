import {AppDispatch} from '../../app/store'
import {grpc} from '@improbable-eng/grpc-web'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {api_url} from '../../common/config'
import {setAccount} from './account-slice'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {setLastError} from '../app/app-slice'
import {AsyncThunkConfig} from '../../common/types'
import {
    CreateAccountRequest,
    CreateAccountResponse,
    CreateAccountResult
} from '../../proto/api/api_types_pb'
import {Account} from '../../proto/types/accounts_pb'
import {base64} from 'ethers/lib/utils'

// Create a new user account
// New account is saved in state or last error is set
export const newAccount = createAsyncThunk(
    'account/new-account',
    async (req: CreateAccountRequest, thunkAPI : AsyncThunkConfig) => {
        const dispatch: AppDispatch = thunkAPI.dispatch!
        dispatch(setLastError(null))

        grpc.unary(CryptomailApiService.CreateAccount, {
            request: req,
            host: api_url,
            onEnd: (output: grpc.UnaryOutput<CreateAccountResponse>) => {

                if (output.status !== grpc.Code.OK || !output.message) {
                    dispatch(setLastError({
                        message: output.statusMessage,
                        reason: "",
                        code: output.status
                    }))
                    return
                }

                const response = output.message!
                const result = response.getResult()
                if (result === CreateAccountResult.CREATE_ACCOUNT_RESULT_CREATED) {
                    let res = response.getAccount()
                    // it should always be an account but we check here jic

                    if (res === undefined) {
                        dispatch(setAccount({account:null, accountName:null}))
                        dispatch(setLastError({
                            message: "Server Error",
                            reason: "Expected account in the results",
                            code: grpc.Code.Internal
                        }))
                    } else {
                        const account = res as Account
                        const name = account.getPublicAccountInfo()!.getName()
                        console.log("🖖 new account successfully created. Name: " + name)

                        // store account name for future sign-in on device
                        // todo: update in one call
                        dispatch(setAccount({account:base64.encode(account.serializeBinary()), accountName:name}))
                    }
                }

                if (result === CreateAccountResult.CREATE_ACCOUNT_RESULT_EXISTS) {
                    dispatch(setLastError({
                        message: "Account already exist. Please login",
                        reason: "",
                        code: grpc.Code.AlreadyExists
                    }))
                }

                if (result === CreateAccountResult.CREATE_ACCOUNT_RESULT_NAME_TAKEN) {
                    dispatch(setLastError({
                        message: "There's already an account with this name. Please enter another name",
                        reason: "",
                        code: grpc.Code.AlreadyExists
                    }))
                }
            }
        })
    }
)

