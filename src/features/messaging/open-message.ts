import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch} from '../../app/store'
import {setLastError} from '../app/app-slice'
import {Keypair, MessageId, PublicKey} from '../../proto/types/types_pb'
import {grpc} from '@improbable-eng/grpc-web'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {api_url} from '../../common/config'
import {
    OpenMessageRequest,
    OpenMessageResponse
} from '../../proto/api/api_types_pb'
import {nanoSecsSinceEpoch} from '../../common/time'
import {ed25519Sign} from '@polkadot/wasm-crypto'
import {u8aToHex} from '@polkadot/util'
import {Account} from '../../proto/types/accounts_pb'

export interface OpenMessageParams {
    sender: Account
    sender_key_pair: Keypair, // sender account key pair
    message_id: MessageId, // 8 bytes - sender provided
}

export const openMessage = createAsyncThunk(
    'messages/openMessage',
    async (params: OpenMessageParams, thunkAPI : AsyncThunkConfig) => {
        console.log("Sending OpenMessage() to server for message id " + u8aToHex(params.message_id.getMessageThreadId_asU8()) +
            ", thread id: " + u8aToHex(params.message_id.getMessageThreadId_asU8()))
        const dispatch: AppDispatch = thunkAPI.dispatch!
        const req = new OpenMessageRequest()

        dispatch(setLastError(null))
        const pub_key = new PublicKey()
        pub_key.setKey(params.sender.getIdPubKey()!.getKey_asU8())
        req.setPublicKey(pub_key)
        req.setMessageId(params.message_id)
        req.setTimeStamp(nanoSecsSinceEpoch())
        const signature = ed25519Sign(params.sender_key_pair.getPublicKey_asU8(),
            params.sender_key_pair.getPrivateKey_asU8(),
            req.serializeBinary()
        )
        req.setSignature(signature)

        grpc.unary(CryptomailApiService.OpenMessage, {
            request: req,
            host: api_url,
            onEnd: (output: grpc.UnaryOutput<OpenMessageResponse>) => {
                if (output.status === grpc.Code.OK) {
                    console.log("OpenMessage(): server returned ok")
                    // todo: update message in state to opened
                } else {
                    console.error("server returned error to call. Code: " + output.status + ", message: " + output.message)
                    /*
                    dispatch(setLastError({
                        message: 'Send Error',
                        reason: output.statusMessage,
                        code: output.status
                    }))*/
                }
            }
        }
    )
})
