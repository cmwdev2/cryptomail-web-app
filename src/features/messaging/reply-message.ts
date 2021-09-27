import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch, RootState} from '../../app/store'
import {setLastError} from '../app/app-slice'
import {Keypair, MessageId, PublicKey} from '../../proto/types/types_pb'
import {
    Message,
    MessageContent, MessageKey,
    MessageServerData,
    MessageUserdata,
    Thread, ThreadBoxType
} from '../../proto/types/content_pb'
import {grpc} from '@improbable-eng/grpc-web'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {api_url} from '../../common/config'
import {ReplyRequest, ReplyResponse} from '../../proto/api/api_types_pb'
import CryptoUtils from '../crypo/crypto'
import {nanoSecsSinceEpoch} from '../../common/time'
import {ed25519Sign} from '@polkadot/wasm-crypto'
import {
    addMessage,
    setReplyResponse,
    setThreadBoxes, setThreads
} from './messaging-slice'
import {base64Encode} from '@polkadot/util-crypto'
import {addOutgoingMessageKey} from '../account/message-keys'
import {
    deserializeThreadBoxes,
    deserializeThreads,
    serializeThreadBoxes,
    serializeThreads
} from './messaging-slice-helpers'
import {Account} from '../../proto/types/accounts_pb'

export interface ReplyMessageParams {
    sender: Account
    sender_key_pair: Keypair, // sender account key pair
    content: MessageContent, // unencrypted yet
    receiver: Account,
    message_id: MessageId, //  sender provided
    reply_to: Uint8Array, // 8 bytes message id this is a reply to
    thread: Thread,       // the reply thread
}

export const replyMessage = createAsyncThunk(
    'messages/reply',
    async (params: ReplyMessageParams, thunkAPI : AsyncThunkConfig) => {

        console.log("ReplyMessage() is running...")
        const dispatch: AppDispatch = thunkAPI.dispatch!
        dispatch(setLastError(null))
        dispatch(setReplyResponse(null))

        const req = new ReplyRequest()
        let outgoing_msg_key : MessageKey

        try {
            const subnet_wasm = await import("@subnetter/subnet-wasm")
            const pre_key_pub_receiver: Uint8Array = params.receiver.getPublicAccountInfo()!.getPreKey()!.getKey_asU8()!
            const eph_private_key = subnet_wasm.x22519_static_secret_from_bytes(CryptoUtils.randomBytes(32))
            const eph_public_key = subnet_wasm.x25519_create_public_key(eph_private_key)

            const shared_secret = subnet_wasm.x25519_diffie_hellman(eph_private_key, pre_key_pub_receiver)
            outgoing_msg_key = new MessageKey()
            outgoing_msg_key.setId(params.message_id)
            outgoing_msg_key.setKey(shared_secret)

            const enc_content = CryptoUtils.aes_encrypt_ui8(shared_secret, params.content.serializeBinary())

            const message_user_data = new MessageUserdata()
            message_user_data.setContent(enc_content)
            message_user_data.setMessageId(params.message_id)
            message_user_data.setCreated(nanoSecsSinceEpoch())
            message_user_data.setReplyTo(params.reply_to)

            const eph_pub = new PublicKey()
            eph_pub.setKey(eph_public_key)
            message_user_data.setEphPubKey(eph_pub)

            const receiver_pub_key = params.receiver.getIdPubKey()
            console.log("recipient pub key: " + CryptoUtils.u8aToHex(receiver_pub_key!.getKey_asU8()))
            message_user_data.setRecipientPublicKey(receiver_pub_key)
            message_user_data.setRecipientPreKeyId(params.receiver.getPublicAccountInfo()!.getPreKey()!.getId())

            const pub_key = new PublicKey()
            pub_key.setKey(params.sender.getIdPubKey()!.getKey_asU8())
            message_user_data.setSenderPublicKey(pub_key)
            const message_user_binary_data = message_user_data.serializeBinary()
            const message_data_signature = ed25519Sign(params.sender_key_pair.getPublicKey_asU8(),
                params.sender_key_pair.getPrivateKey_asU8(),
                message_user_binary_data
            )
            req.setMessageUserData(message_user_binary_data)
            req.setMessageUserDataSignature(message_data_signature)
            req.setTimeStamp(nanoSecsSinceEpoch())
            req.setPublicKey(pub_key)
            req.setMessageId(params.message_id)

            const signature = ed25519Sign(params.sender_key_pair.getPublicKey_asU8(),
                params.sender_key_pair.getPrivateKey_asU8(),
                req.serializeBinary())
            req.setSignature(signature)

        } catch (error) {
            console.log("failed to prepare reply message: " + error)
            dispatch(setLastError({
                message: 'Send Error',
                reason: 'Failed to prepare reply data',
                code: grpc.Code.InvalidArgument
            }))
            return
        }

        const state: RootState = thunkAPI.getState()

        grpc.unary(CryptomailApiService.Reply, {
            request: req,
            host: api_url,
            onEnd: (output: grpc.UnaryOutput<ReplyResponse>) => {
                if (output.status !== grpc.Code.OK) {
                    console.log("server returned error to call. Code: " + output.status + ", message: " + output.message)
                    dispatch(setLastError({
                        message: 'Send Error',
                        reason: output.statusMessage,
                        code: output.status
                    }))
                    return
                }

                console.log("Reply message response: ok")

                // add the message to message store
                const message = new Message()
                const fake_server_data = new MessageServerData()
                fake_server_data.setOpened(false)
                fake_server_data.setReplied(false)
                message.setMessageId(req.getMessageId())
                message.setAuthorData(req.getMessageUserData_asU8())
                message.setServerData(fake_server_data)

                // set reply on original message!

                // add the message to the store
                dispatch(addMessage(base64Encode(message.serializeBinary())))

                // store outgoing message key so we can later decrypt it for local user display
                dispatch(addOutgoingMessageKey(outgoing_msg_key))

                // Add the reply message id to the thread and update threads state in store

                const threads = deserializeThreads(state.messages.threads)
                const thread_id = params.thread.getId_asU8()
                const thread_id_str = thread_id.toString()
                for (const thread of threads) {
                    if (thread.getId_asU8().toString() ===  thread_id_str) {
                        const msgs_ids = thread.getMsgsIdsList_asU8()
                        msgs_ids.push(params.message_id.getMessageThreadId_asU8())
                    }
                }
                dispatch(setThreads(serializeThreads(threads)))

                const thread_boxes = deserializeThreadBoxes(state.messages.thread_boxes)
                for (const box of thread_boxes) {
                    if (box.getThreadBoxType() === ThreadBoxType.THREAD_BOX_TYPE_SENT) {
                        let already_in_sent = false
                        for (const id of box.getThreadIdsList_asU8()) {
                            if (id.toString() === thread_id_str) {
                                already_in_sent = true
                                break
                            }
                        }
                        if (!already_in_sent) {
                            box.addThreadIds(thread_id)
                        }
                        break
                    }
                }

                dispatch(setThreadBoxes(serializeThreadBoxes(thread_boxes)))

                const resp_data = CryptoUtils.u8aToHexNoPrefix(output.message!.serializeBinary())
                dispatch(setReplyResponse(resp_data))
            }
        }
    )
})
