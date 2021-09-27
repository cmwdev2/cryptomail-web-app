import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch, RootState} from '../../app/store'
import CryptoUtils from '../crypo/crypto'
import { setAccount } from './account-slice'
import {setLastError} from '../app/app-slice'
import {Account, Settings} from '../../proto/types/accounts_pb'
import {PublicKey, PublicAccountInfo} from '../../proto/types/types_pb'
import {UpdateSettingsRequest, UpdateSettingsResponse} from '../../proto/api/api_types_pb'
import {nanoSecsSinceEpoch} from '../../common/time'
import {
    sha512,
    ed25519KeypairFromSeed,
    ed25519Sign,
    ed25519Verify
} from '@polkadot/wasm-crypto'
import {u8aToHex} from '@polkadot/util'
import {api_url, USER_ACCOUNT_DERIVE_ID} from '../../common/config'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {grpc} from '@improbable-eng/grpc-web'
import {base64} from 'ethers/lib/utils'

// Requested updated settings (unsigned)
export interface UpdateSettingsParams {
    settings: Settings,
    account_info: PublicAccountInfo,
}

// Update user settings
export const updateSettings = createAsyncThunk(
    'account/update-settings',
    async (params: UpdateSettingsParams, thunkAPI : AsyncThunkConfig) => {
        console.log('update settings() with user input: ' + params.account_info.getName())
        const dispatch: AppDispatch = thunkAPI.dispatch!
        const state: RootState = thunkAPI.getState()

        dispatch(setLastError(null))
        try {
            // account keys
            const entropy = CryptoUtils.derivePrivateKeySeed(state.account.seed, USER_ACCOUNT_DERIVE_ID)
            const entropyBytes: Uint8Array = CryptoUtils.hexToU8NoPrefix(entropy)
            const key_pair_data = ed25519KeypairFromSeed(entropyBytes)
            const public_key_data = key_pair_data.subarray(32, 64) // last 32 byte is public
            const private_key_data = key_pair_data.subarray(0, 32) // first 32 bytes is private

            // sign new user-provided account info
            const account_info_bytes = params.account_info.serializeBinary()
            const signature = ed25519Sign(public_key_data, private_key_data, account_info_bytes)
            params.account_info.setSignature(signature)

            const pubKey = new PublicKey()
            pubKey.setKey(public_key_data)

            const updateRequest = new UpdateSettingsRequest()
            updateRequest.setPublicKey(pubKey)
            updateRequest.setSettings(params.settings)
            updateRequest.setPublicAccountInfo(params.account_info)
            updateRequest.setTimeStamp(nanoSecsSinceEpoch())

            const request_bytes = updateRequest.serializeBinary()
            const request_hash = sha512(request_bytes)
            console.log("request sha512: " + u8aToHex(request_hash))
            const request_signature = ed25519Sign(public_key_data, private_key_data, request_bytes)
            updateRequest.setSignature(request_signature)

            // verify signature (debugging)
            const isVerified = ed25519Verify(request_signature, request_bytes, public_key_data)
            console.log("signature verification: " + isVerified)

             grpc.unary(CryptomailApiService.UpdateSettings, {
                request: updateRequest,
                host: api_url,
                onEnd: (output: grpc.UnaryOutput<UpdateSettingsResponse>) => {
                    if (output.status !== grpc.Code.OK) {
                        dispatch(setLastError({
                            message: "Server Error",
                            reason: output.statusMessage,
                            code: output.status
                        }))
                        return
                    }

                    // update local user data
                    const account: Account = Account.deserializeBinary(base64.decode(state.account.account))
                    const name = account.getPublicAccountInfo()!.getName()
                    account.setSettings(params.settings)
                    account.setPublicAccountInfo(params.account_info)
                    dispatch(setAccount({account:base64.encode(account.serializeBinary()), accountName:name}))
                }
             })
        } catch (error) {
            console.log("Update settings error: " + error)
        }
    }
)
