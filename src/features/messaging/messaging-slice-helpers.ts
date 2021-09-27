/// User account data
import {Message, Thread, ThreadBox, ThreadBoxTypeMap} from '../../proto/types/content_pb'
import {base64Decode, base64Encode} from '@polkadot/util-crypto'
import {u8aToHex} from '@polkadot/util'
import {getUniqueMessageId} from '../../common/message-id'
import {Account} from "../../proto/types/accounts_pb";

// todo: add thread_id + msg_id of the last sent message by user

export function serializeMessages(data: Array<Message>) : Array<string> {
    const messages = new Array<string>()
    for (const message of data) {
        messages.push(base64Encode(message.serializeBinary()))
    }
    return messages
}

export function serializeAccounts(data: Array<Account>) : Array<string> {
    const infos = new Array<string>()
    for (const message of data) {
        infos.push(base64Encode(message.serializeBinary()))
    }
    return infos
}

// Restore messages from array of serialized serialized binary data
export function deserializeMessages(data: Array<string>) : Array<Message> {
    const messages = new Array<Message>()
    for (const item of data) {
        const message: Message = Message.deserializeBinary(base64Decode(item))
        messages.push(message)
    }
    return messages
}

/// map of messages by
export function deserializeMessagesMap(data: Array<string>) : Map<string, Message> {
    const result = new Map<string, Message>()
    for (const item of data) {
        const m: Message = Message.deserializeBinary(base64Decode(item))
        const key = u8aToHex(getUniqueMessageId(m.getMessageId()!))
        result.set(key, m)
    }
    return result
}

// Restore messages from array of serialized serialized binary data
export function deserializeAccounts(data: Array<string>) : Array<Account> {
    const infos = new Array<Account>()
    for (const item of data) {
        const info: Account = Account.deserializeBinary(base64Decode(item))
        infos.push(info)
    }
    return infos
}

export function deserializeAccountsMap(data: Array<string>) : Map<string, Account> {
    const result = new Map<string, Account>()
    for (const item of data) {
        const account: Account = Account.deserializeBinary(base64Decode(item))
        const account_key = u8aToHex(account.getIdPubKey()!.getKey_asU8())
        console.log("Adding account " + account_key)
        result.set(account_key, account)
    }
    return result
}


export function serializeThreads(data: Array<Thread>) : Array<string> {
    const res = new Array<string>()
    for (const thread of data) {
        res.push(base64Encode(thread.serializeBinary()))
    }
    return res
}

export function deserializeThreads(data: Array<string>) : Array<Thread> {
    const res = new Array<Thread>()
    for (const thread of data) {
        res.push(Thread.deserializeBinary(base64Decode(thread)))
    }
    return res
}

export function deserializeThreadsMap(data: Array<string>) : Map<string, Thread> {
    const threads = deserializeThreads(data)
    const result = new Map<string, Thread>()
    for (const t of threads) {
        result.set(u8aToHex(t.getId_asU8()), t)
    }
    return result
}

export function serializeThreadBoxes(data: Array<ThreadBox>) : Array<string> {
    const res = new Array<string>()
    for (const box of data) {
        res.push(base64Encode(box.serializeBinary()))
    }
    return res
}

export function deserializeThreadBoxes(data: Array<string>) : Array<ThreadBox> {
    const res = new Array<ThreadBox>()
    for (const box of data) {
        res.push(ThreadBox.deserializeBinary(base64Decode(box)))
    }
    return res
}

export function deserializeThreadBoxesMap(data: Array<string>) : Map<ThreadBoxTypeMap[keyof ThreadBoxTypeMap], ThreadBox> {
    const boxes = deserializeThreadBoxes(data)
    const result = new Map<ThreadBoxTypeMap[keyof ThreadBoxTypeMap], ThreadBox>()
    for (const box of boxes) {
        result.set(box.getThreadBoxType(), box)
    }
    return result
}

