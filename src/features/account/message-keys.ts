import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch, getRootState, RootState} from '../../app/store'
import CryptoUtils from '../crypo/crypto'
import {
    setOutgoingMessagesKeys
} from './account-slice'

import {MessageId} from '../../proto/types/types_pb'
import {MessageKey, MessageKeys} from '../../proto/types/content_pb'
import {USER_ACCOUNT_DERIVE_ID} from '../../common/config'

export function getOutgoingMessageKeyFrom(keys: MessageKeys, id: MessageId) : Uint8Array | null {

    for (const m of keys.getMessageKeysList()) {
        const thread_id = m.getId()!.getThreadId_asU8().toString()
        if (thread_id !== id.getThreadId_asU8().toString()) {
            continue
        }
        const message_id = m.getId()!.getMessageThreadId_asU8().toString()
        if (message_id === id.getMessageThreadId_asU8().toString()) {
            return m.getKey_asU8()
        }
    }
    return null
}

// Returns the encryption key for an outgoing message if it is available in store or null otherwise
export function getOutgoingMessageKey(id: MessageId) : Uint8Array | null {
    const state = getRootState()

    if (state.account.seed === null) {
        console.warn("seed is not available - aborting addOutgoingMessageKey")
    }

    if (state.account.enc_outgoing_messages_keys === null) {
        return null
    }

    const key = CryptoUtils.derivePrivateKeySeed(state.account.seed, USER_ACCOUNT_DERIVE_ID)
    const data = CryptoUtils.aes_decrypt(key, state.account.enc_outgoing_messages_keys)
    const messages_keys = MessageKeys.deserializeBinary(CryptoUtils.hexToU8NoPrefix(data))

    return getOutgoingMessageKeyFrom(messages_keys, id)
}


// Add a MessageKey to the outgoing messages key store
export const addOutgoingMessageKey = createAsyncThunk(
    'account/add_outgoing_message_key',
    async (item: MessageKey, thunkAPI : AsyncThunkConfig) => {
        const dispatch: AppDispatch = thunkAPI.dispatch!
        const state: RootState = thunkAPI.getState()

        if (state.account.seed === null) {
            console.warn("seed is not available - aborting addOutgoingMessageKey")
        }

        let messages_keys : MessageKeys
        const key = CryptoUtils.derivePrivateKeySeed(state.account.seed, USER_ACCOUNT_DERIVE_ID)

        if (state.account.enc_outgoing_messages_keys !== null) {
            const data = CryptoUtils.aes_decrypt(key, state.account.enc_outgoing_messages_keys)
            messages_keys = MessageKeys.deserializeBinary(CryptoUtils.hexToU8NoPrefix(data))
        } else {
            messages_keys = new MessageKeys()
        }

        messages_keys.addMessageKeys(item)
        const updated_data = CryptoUtils.u8aToHexNoPrefix(messages_keys.serializeBinary())
        const enc_data = CryptoUtils.aes_encrypt(key, updated_data)
        dispatch(setOutgoingMessagesKeys(enc_data))
    })
