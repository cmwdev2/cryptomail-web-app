import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch, RootState} from '../../app/store'
import {setLastError} from '../app/app-slice'
import {Keypair, PublicAccountInfo, PublicKey} from '../../proto/types/types_pb'
import {grpc} from '@improbable-eng/grpc-web'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {api_url} from '../../common/config'
import {
    ArchiveThreadRequest, ArchiveThreadResponse
} from '../../proto/api/api_types_pb'
import {nanoSecsSinceEpoch} from '../../common/time'
import {ed25519Sign} from '@polkadot/wasm-crypto'
import {u8aToHex} from '@polkadot/util'
import {
    setArchiveThreadResponse,
    setThreadBoxes
} from './messaging-slice'
import {ThreadBoxType} from '../../proto/types/content_pb'
import CryptoUtils from '../crypo/crypto'
import {deserializeThreadBoxes, serializeThreadBoxes} from './messaging-slice-helpers'

export interface ArchiveThreadParams {
    local_user: PublicAccountInfo
    local_user_key_pair: Keypair, // sender account key pair
    thread_id: Uint8Array, // 8 bytes - sender provided
}

export const archiveThread= createAsyncThunk(
    'messages/archiveThread',
    async (params: ArchiveThreadParams, thunkAPI : AsyncThunkConfig) => {
        console.log("Sending Archive Thread() to server for thread id " + u8aToHex(params.thread_id))
        const dispatch: AppDispatch = thunkAPI.dispatch!
        const req = new ArchiveThreadRequest()
        try {
            dispatch(setLastError(null))
            dispatch(setArchiveThreadResponse(null))
            const pub_key = new PublicKey()
            pub_key.setKey(params.local_user.getPublicKey()!.getKey_asU8())
            req.setPublicKey(pub_key)
            req.setThreadId(params.thread_id)
            req.setTimeStamp(nanoSecsSinceEpoch())
            const signature = ed25519Sign(params.local_user_key_pair.getPublicKey_asU8(),
                params.local_user_key_pair.getPrivateKey_asU8(),
                req.serializeBinary()
            )
            req.setSignature(signature)
        } catch (error) {
            console.log("failed to prepare archive thread message req: " + error)
            dispatch(setLastError({
                message: 'Send Error',
                reason: 'Failed to send message to the server',
                code: grpc.Code.InvalidArgument
            }))
            return
        }

        grpc.unary(CryptomailApiService.ArchiveThread, {
            request: req,
            host: api_url,
            onEnd: (output: grpc.UnaryOutput<ArchiveThreadResponse>) => {
                if (output.status !== grpc.Code.OK || output.message === null) {
                    console.log("server returned error to call. Code: " + output.status + ", message: " + output.message)
                    dispatch(setLastError({
                        message: 'Send Error',
                        reason: output.statusMessage,
                        code: output.status
                    }))
                    return
                }

                const state: RootState = thunkAPI.getState()
                const thread_id = params.thread_id.toString()
                console.log("Archive Thread(): server returned ok")

                // move thread from inbox to archive box to save another round-trip with the server
                const thread_boxes = deserializeThreadBoxes(state.messages.thread_boxes)
                let thread_to_move_id = null
                for (const box of thread_boxes) {
                    if (box.getThreadBoxType() === ThreadBoxType.THREAD_BOX_TYPE_INBOX) {
                        thread_to_move_id = box.getThreadIdsList_asU8().find(id => id.toString() === thread_id)!
                        let updated_threads_ids = box.getThreadIdsList_asU8().filter(id => id.toString() !== thread_id)
                        box.setThreadIdsList(updated_threads_ids)
                        break
                    }
                }

                if (thread_to_move_id === null) {
                    console.error("expected to find thread id in inbox")
                    return
                }

                for (const box of thread_boxes) {
                    if (box.getThreadBoxType() === ThreadBoxType.THREAD_BOX_TYPE_ARCHIVE) {
                        // todo: double check that thread is not already in archive
                        box.addThreadIds(thread_to_move_id)
                        break
                    }
                }

                dispatch(setThreadBoxes(serializeThreadBoxes(thread_boxes)))
                const response_data = CryptoUtils.u8aToHexNoPrefix(output.message!.serializeBinary())
                dispatch(setArchiveThreadResponse(response_data))
            }
        }
    )
})
