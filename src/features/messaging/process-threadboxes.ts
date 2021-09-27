import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {GetThreadBoxesResponse} from '../../proto/api/api_types_pb'
import {ed25519Verify} from '@polkadot/wasm-crypto'
import {Message, MessageUserdata} from '../../proto/types/content_pb'
import {
    updateWithServerMessagesState
} from './messaging-slice'
import {AppDispatch, RootState} from '../../app/store'
import {u8aToHex} from '@polkadot/util'
import {getUniqueMessageId} from '../../common/message-id'
import {
    deserializeAccountsMap,
    deserializeMessagesMap,
    deserializeThreadBoxesMap,
    deserializeThreadsMap, serializeAccounts, serializeMessages, serializeThreadBoxes, serializeThreads
} from './messaging-slice-helpers'
import {Account} from "../../proto/types/accounts_pb";

// process server thread-boxes data
export const processServerThreadBoxes = createAsyncThunk(
    'messages/process-server-thread-box',
    async (params: GetThreadBoxesResponse, thunkAPI : AsyncThunkConfig) => {

        const dispatch: AppDispatch = thunkAPI.dispatch!
        const state: RootState = thunkAPI.getState()

        // authenticate all senders
        const valid_accounts = new Array<Account>()
        // validate all account infos received
        for(const account of params.getAccountsList()) {
            const info = account.getPublicAccountInfo()!
            const signature = info.getSignature_asU8()
            const pub_key = account.getIdPubKey()!.getKey_asU8()
            info.setSignature(new Uint8Array())
            const data = info.serializeBinary()
            const isValid = ed25519Verify(signature, data, pub_key)
            if (isValid) {
                console.log("✅ account " + info.getName() + " authenticated")
                valid_accounts.push(account)
            } else {
                console.log("🙈 account " + info.getName() + " not authenticated - dropping it")
                // todo: drop messages from this account - only add authenticated messages
            }

            info.setSignature(signature)
        }

        // authenticate all incoming messages and only add valid ones
        const all_messages = params.getMessagesList()
        const valid_messages = new Array<Message>()
        console.log(">>> Total messages from server: " + all_messages.length)
        for (const message of all_messages) {
            const message_user_data = MessageUserdata.deserializeBinary(message.getAuthorData_asU8())
            const signature = message.getSignature_asU8()
            const pub_key = message_user_data.getSenderPublicKey()!.getKey_asU8()
            // console.log("message data hex: " + u8aToHex(message.getAuthorData_asU8()))
            // console.log("message data: " + message.getAuthorData_asU8())
            // console.log("signature: " + u8aToHex(signature))
            // console.log("pub key: " + u8aToHex(pub_key))

            // todo: check that author public info is authentic and only add messages that we have the
            // authenticated sender public account info

            const verified = ed25519Verify(signature, message.getAuthorData_asU8(), pub_key)
            if (verified) {
                console.log("🥂 adding authentic message")
                valid_messages.push(message)
            } else {
                console.warn("discarding unauthentic message")
            }
        }

        // merge in results into the existing messages store

        const thread_boxes = params.getThreadsBoxesList()
        console.log(">>> Total thread-boxes from server: " + thread_boxes.length)

        const existing_thread_boxes = deserializeThreadBoxesMap(state.messages.thread_boxes)
        for (const tb of thread_boxes) {
            existing_thread_boxes.set(tb.getThreadBoxType(), tb)
        }

        const existing_accounts = deserializeAccountsMap(state.messages.accounts)
        for (const a of valid_accounts) {
            existing_accounts.set(u8aToHex(a.getIdPubKey()!.getKey_asU8()), a)
        }

        const threads = params.getThreadsList()
        console.log(">>> Total threads returned: " + threads.length)

        const existing_threads = deserializeThreadsMap(state.messages.threads)
        for (const t of threads) {
            existing_threads.set(u8aToHex(t.getId_asU8()), t)
        }

        const existing_messages = deserializeMessagesMap(state.messages.messages)
        for (const m of valid_messages) {
            existing_messages.set(u8aToHex(getUniqueMessageId(m.getMessageId()!)), m)
        }

        // Store thread-boxes and messages received from server
        dispatch(updateWithServerMessagesState({
            messages: serializeMessages(Array.from(existing_messages.values())),
            thread_boxes: serializeThreadBoxes(Array.from(existing_thread_boxes.values())),
            accounts: serializeAccounts(Array.from(existing_accounts.values())),
            threads: serializeThreads(Array.from(existing_threads.values())),
            unread_count: 0,
            last_new_thread_response: null,
            last_archive_thread_response: null,
            last_replay_response: null,
        }))
    })
