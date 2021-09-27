import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch, RootState} from '../../app/store'
import {setLastError} from '../app/app-slice'
import {Keypair, MessageId, Payment, PublicKey} from '../../proto/types/types_pb'
import {
    Message,
    MessageContent, MessageKey,
    MessageServerData,
    MessageUserdata,
    Thread,
    ThreadBoxType
} from '../../proto/types/content_pb'
import {grpc} from '@improbable-eng/grpc-web'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {api_url} from '../../common/config'
import {NewThreadRequest, NewThreadResponse} from '../../proto/api/api_types_pb'
import CryptoUtils from '../crypo/crypto'
import {nanoSecsSinceEpoch} from '../../common/time'
import {ed25519Sign} from '@polkadot/wasm-crypto'
import {
    addMessage,
    setAccounts,
    setNewThreadResponse, setThreadBoxes, setThreads
} from './messaging-slice'
import {base64Encode} from '@polkadot/util-crypto'
import {addOutgoingMessageKey} from '../account/message-keys'
import {
    deserializeAccounts,
    deserializeThreadBoxes,
    deserializeThreads,
    serializeAccounts, serializeThreadBoxes, serializeThreads
} from './messaging-slice-helpers'
import {Account} from "../../proto/types/accounts_pb";

export interface SendNewThreadParams {
    sender: Account
    sender_key_pair: Keypair, // sender account key pair
    content: MessageContent, // unencrypted yet
    receiver: Account,
    message_id: MessageId, // 8 bytes - sender provided
    payment: Payment, // payment info (tx, amount, payment type...)
}

// Add an account info to the message store. If it exists then update its data in store
export const addAccount = createAsyncThunk(
    'messages/addAccount',
    async (account: Account, thunkAPI : AsyncThunkConfig) => {

        console.log("AddAccountInfo() is running...")
        const dispatch: AppDispatch = thunkAPI.dispatch!
        const state: RootState = thunkAPI.getState()

        const accounts : Array<Account> = deserializeAccounts(state.messages.accounts)
        for (const [index, otherAccount] of accounts.entries()) {
            if (account.getIdPubKey()!.getKey_asU8().toString() === otherAccount.getIdPubKey()!.getKey_asU8().toString()) {
                console.log('account already in state - updating account data')
                accounts[index] = account
                return
            }
        }

        accounts.push(account)
        dispatch(setAccounts(serializeAccounts(accounts)))
    })

export const newThread = createAsyncThunk(
    'messages/sendNewThread',
    async (params: SendNewThreadParams, thunkAPI : AsyncThunkConfig) => {

        console.log("SendNewThread() is running...")
        const dispatch: AppDispatch = thunkAPI.dispatch!
        dispatch(setNewThreadResponse(null))
        dispatch(setLastError(null))
        const req = new NewThreadRequest()

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
            message_user_data.setPayment(params.payment)

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
            console.log("failed to prepare new thread message: " + error)
            dispatch(setLastError({
                message: 'Send Error',
                reason: 'Failed to prepare new thread data',
                code: grpc.Code.InvalidArgument
            }))
            return
        }

        const state: RootState = thunkAPI.getState()

        grpc.unary(CryptomailApiService.NewThread, {
            request: req,
            host: api_url,
            onEnd: (output: grpc.UnaryOutput<NewThreadResponse>) => {
                if (output.status !== grpc.Code.OK || output.message === null) {
                    console.log("server returned error to call. Code: " + output.status + ", message: " + output.message)
                    dispatch(setLastError({
                        message: 'Send Error',
                        reason: output.statusMessage,
                        code: output.status
                    }))
                    return
                }

                const result = output.message.getResult()
                console.log("NewThread server result code: " + result)
                // console.log("thread id: " + output.message!.getMessageId()!.getThreadId())
                const data = CryptoUtils.u8aToHexNoPrefix(output.message!.serializeBinary())
                console.log("hex newThread response data data:" + data)
                dispatch(setNewThreadResponse(data))

                // add the message to message store
                const message = new Message()
                const fake_server_data = new MessageServerData()
                fake_server_data.setOpened(false)
                fake_server_data.setReplied(false)
                message.setMessageId(req.getMessageId())
                message.setAuthorData(req.getMessageUserData_asU8())
                message.setServerData(fake_server_data)
                dispatch(addMessage(base64Encode(message.serializeBinary())))

                // store outgoing message key so we can later decrypt it for local user display
                dispatch(addOutgoingMessageKey(outgoing_msg_key))

                // add the thread to the user's sent items box in store
                const thread = new Thread()
                thread.setId(req.getMessageId()!.getThreadId()!)
                thread.setMsgsIdsList([req.getMessageId()!.getMessageThreadId_asU8()!])
                const thread_boxes = deserializeThreadBoxes(state.messages.thread_boxes)
                for (const box of thread_boxes) {
                    if (box.getThreadBoxType() === ThreadBoxType.THREAD_BOX_TYPE_SENT) {
                        // add new thread to sent items box
                        box.addThreadIds(thread.getId_asU8(), 0)
                        break
                    }
                }

                const threads = deserializeThreads(state.messages.threads)
                threads.push(thread)
                dispatch(setThreads(serializeThreads(threads)))
                dispatch(setThreadBoxes(serializeThreadBoxes(thread_boxes)))

                // add receiver to store account info or update its info
                dispatch(addAccount(params.receiver))
            }
        }
    )
})
