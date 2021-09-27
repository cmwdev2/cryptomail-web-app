import {MessageId} from '../proto/types/types_pb'

// Returns unique message id which is also the contract's withdraw and deposit id
export function getUniqueMessageId(messageId: MessageId) : Uint8Array {
    const withdrawId = new Uint8Array(16)
    withdrawId.set(messageId.getThreadId_asU8(), 0)
    withdrawId.set(messageId.getMessageThreadId_asU8(), 8)
    console.log("withdraw id: " + withdrawId)
    return withdrawId
}

