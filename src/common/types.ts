import {RootState} from '../app/store'
import {Dispatch} from '@reduxjs/toolkit'
import {PublicAccountInfo} from "../proto/types/types_pb";
import {MessageContent, MessageServerData, MessageUserdata, Thread} from '../proto/types/content_pb'
import {Account} from '../proto/types/accounts_pb'

export type AsyncThunkConfig = {
    /** return type for `thunkApi.getState` */
    getState?: RootState
    /** type for `thunkApi.dispatch` */
    dispatch?: Dispatch
    /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
    extra?: unknown
    /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
    rejectValue?: unknown
    /** return type of the `serializeError` option callback */
    serializedErrorType?: unknown
    /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
    pendingMeta?: unknown
    /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
    fulfilledMeta?: unknown
    /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
    rejectedMeta?: unknown
}

export type OptionalString = string | null
export type OptionalNumber = number | null
export type OptionalAccountInfo = PublicAccountInfo | null
export type OptionalAccount = Account | null

// Complete message data for message display with all content authenticated and decrypted
export type MessageData = {
    sender: Account // message sender info
    message: MessageServerData // message server data
    user_data: MessageUserdata // message author data
    content: MessageContent // decrypted message content
    receiver: Account // message receiver info
    thread:  Thread
}

export type OptionalMessageData = MessageData | null

// A thread with messages - all content decrypted and authenticated. Messages are indexed by prefixed hex string message thread id
export type ThreadWithMessages = {thread: Thread, messages: Map<string, MessageData>}

export type OptionalThread = ThreadWithMessages | null
