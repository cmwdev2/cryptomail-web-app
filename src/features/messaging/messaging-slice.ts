/// User account data
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {OptionalString} from '../../common/types'

// todo: add thread_id + msg_id of the last sent message by user

export interface MessageStoreState {
    messages: Array<string> // unique messages serialized bas64
    thread_boxes: Array<string> // base64 encoded list of boxes (contain thread ids)
    threads: Array<string> // based64 encoded threads (contain message id)
    accounts: Array<string>, // array of base64 encoded other user accounts (not infos)
    unread_count: number // inbox messages which were not opened yet
    last_new_thread_response: OptionalString // hex no prefix string serialized NewThreadResponse object or null
    last_archive_thread_response: OptionalString // hex no prefix string serialized ArchiveThreadResponse object or null
    last_replay_response: OptionalString // hex no prefix serialized ReplayResponse
}

export interface MessageStoreServerUpdate {
    messages: Array<string> // unique messages serialized bas64
    thread_boxes: Array<string> // base64 encoded thread_box
    threads: Array<string> // based64 encoded threads (contain message id)
    accounts: Array<string>,
    unread_count: number // inbox messages which were not opened yet
    last_new_thread_response: OptionalString // hex no prefix string serialized NewThreadResponse object or null
    last_archive_thread_response: OptionalString
    last_replay_response: OptionalString
}

export const initialMessagesState : MessageStoreState = {
    messages: new Array<string>(),
    thread_boxes: new Array<string>(),
    threads: new Array<string>(),
    accounts: new Array<string>(),
    unread_count: 0,
    last_new_thread_response: null,
    last_archive_thread_response: null,
    last_replay_response: null,
}

// set init state from store if possible
function getInitialMessagesState() : MessageStoreState {
    return Object.assign({}, initialMessagesState)
}

const messagingSlice = createSlice({
    name: 'messages',
    initialState: getInitialMessagesState(),
    reducers: {
        updateWithServerMessagesState(state, action: PayloadAction<MessageStoreServerUpdate>) {
            state.messages =  action.payload.messages
            state.thread_boxes = action.payload.thread_boxes
            state.threads = action.payload.threads
            state.accounts = action.payload.accounts
            state.unread_count = action.payload.unread_count
            state.last_new_thread_response = action.payload.last_new_thread_response
            state.last_archive_thread_response = action.payload.last_archive_thread_response
            state.last_replay_response = action.payload.last_replay_response
        },
        /*
        addOutgoingMessageKey(state, action: PayloadAction<OutgoingMessagesKeysEntry>) {
            state.outgoing_messages_keys.push(action.payload)
        },*/
        addMessage(state, action: PayloadAction<string>) {
            // add a message to the store
            state.messages.push(action.payload)
        },
        setAccounts(state, action: PayloadAction<Array<string>>) {
            state.accounts = action.payload
        },
        setThreadBoxes(state, action: PayloadAction<Array<string>>) {
            // replace thread-boxes with provided ones - all for now. Allow to replace only one later.
            state.thread_boxes = action.payload
        },
        setThreads(state, action: PayloadAction<Array<string>>) {
            // replace threads with provided ones - all for now. Allow to replace only one later.
            state.threads = action.payload
        },
        setUnreadCount(state, action: PayloadAction<number>) {
            state.unread_count = action.payload
        },
        setNewThreadResponse(state, action: PayloadAction<OptionalString>) {
            state.last_new_thread_response = action.payload
        },
        setArchiveThreadResponse(state, action: PayloadAction<OptionalString>) {
            state.last_archive_thread_response = action.payload
        },
        setReplyResponse(state, action: PayloadAction<OptionalString>) {
            state.last_replay_response = action.payload
        },
        resetMessages(state) {
           state = getInitialMessagesState()
        },
    }
})

export const { setThreads, setReplyResponse, setArchiveThreadResponse, addMessage, setAccounts, setThreadBoxes, resetMessages, updateWithServerMessagesState, setUnreadCount, setNewThreadResponse } = messagingSlice.actions
export default messagingSlice.reducer
