import {AppDispatch} from '../../app/store'
import {grpc} from '@improbable-eng/grpc-web'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {api_url} from '../../common/config'
import {setAccount} from './account-slice'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {setLastError} from '../app/app-slice'
import {AsyncThunkConfig} from '../../common/types'
import {
    GetAccountRequest,
    GetAccountResponse,
} from '../../proto/api/api_types_pb'
import {base64Encode} from '@polkadot/util-crypto'

// Account related server api thunks (async actions)

// Get an account  based on account name or address for purpose of login flow.
// No need to sign the request. Will update AccountInfo in account state or set an error
export const getAccountAction = createAsyncThunk(
'account/get-account',
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
            } else {
                const account = output.message!.getAccount()
                if (!account) {
                    dispatch(setLastError({
                        message: "There is no account named " + req.getName(),
                        reason: "", // technical error
                        code: grpc.Code.NotFound
                    }))
                    return
                }

                const account_info = account.getPublicAccountInfo()
                if (!account_info) {
                    console.error("missing account info for account")
                }

                const payment_info = account_info!.getPaymentSettings()
                if (!payment_info) {
                    console.error("missing payment info from user info from server")
                }

                const account_str = base64Encode(account.serializeBinary())
                console.log("updating account info from server for account: " + req.getName())
                dispatch(setAccount({account:account_str, accountName:req.getName()}))
            }
        }
    })
})


