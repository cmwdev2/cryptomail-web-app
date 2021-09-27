import {
    MessageContent,
    MessageKeys,
    MessageUserdata,
    ThreadBoxType,
} from '../../proto/types/content_pb'
import {MessageData, ThreadWithMessages} from '../../common/types'
import {AppDispatch, getRootState} from '../../app/store'
import {
    setUnreadCount
} from './messaging-slice'
import CryptoUtils from '../crypo/crypto'
import {MessageId} from '../../proto/types/types_pb'
import {base64} from 'ethers/lib/utils'
import {u8aToHex} from '@polkadot/util'
import {USER_ACCOUNT_DERIVE_ID} from '../../common/config'
import {getOutgoingMessageKeyFrom} from '../account/message-keys'
import {
    deserializeAccountsMap,
    deserializeMessages,
    deserializeThreadBoxes,
    deserializeThreadsMap
} from './messaging-slice-helpers'
import {Account} from '../../proto/types/accounts_pb'

// Get threadbox data required to display a threadbox with message to local user
export async function getThreadBoxData(boxType: number, dispatch: AppDispatch) : Promise<Map<string, ThreadWithMessages>> {
    console.log("📦 processing a box messages...")
    const subnet_wasm = await import("@subnetter/subnet-wasm")
    const threads = new Map<string, ThreadWithMessages>()
    try {
        const state = getRootState()
        const all_threads = deserializeThreadsMap(state.messages.threads)

        // index all threads
        const thread_boxes = deserializeThreadBoxes(state.messages.thread_boxes)
        console.log("thread boxes count: " + thread_boxes.length)
        const thread_ids = new Set<string>()
        // let getThreadData = false
        // index threads we got in the response for later use

        for (const box of thread_boxes) {
            console.log("box type from server: " + box.getThreadBoxType())
            console.log("Current viewed thread box: " + boxType)
            if (box.getThreadBoxType() === boxType) {
                console.log("found thread-box...")
                // getThreadData = true
                for (const id of box.getThreadIdsList_asU8()) {
                    const idHex = CryptoUtils.u8aToHex(id)
                    const thread = all_threads.get(idHex)!
                    console.log("🧵 adding thread id: " + idHex + ", total messages: " + thread.getMsgsIdsList().length)
                    const thread_data = {thread: thread, messages: new Map<string, MessageData>()}
                    threads.set(idHex, thread_data)
                    thread_ids.add(idHex)
                }
                break
            }
        }

        const local_account: Account = Account.deserializeBinary(base64.decode(state.account.account))
        console.log("local account id: " + u8aToHex(local_account.getIdPubKey()!.getKey_asU8()))

        const all_accounts = deserializeAccountsMap(state.messages.accounts)
        const all_messages = deserializeMessages(state.messages.messages)
        let unread_messages = 0
        let outgoing_messages_keys: MessageKeys
        // prepare data of all outgoing messages' shared secrets so it doesn't need to be done once per message
        if (state.account.enc_outgoing_messages_keys !== null) {
            const key = CryptoUtils.derivePrivateKeySeed(state.account.seed, USER_ACCOUNT_DERIVE_ID)
            const data = CryptoUtils.aes_decrypt(key, state.account.enc_outgoing_messages_keys)
            outgoing_messages_keys = MessageKeys.deserializeBinary(CryptoUtils.hexToU8NoPrefix(data))
        } else {
            outgoing_messages_keys = new MessageKeys()
        }

        for (const message of all_messages) {
            try {
                const messageId = message.getMessageId()!
                const threadIdHex = CryptoUtils.u8aToHex(messageId.getThreadId_asU8())
                if (!thread_ids.has(threadIdHex)) {
                    // message is not in a thread in this box
                    continue
                }

                const messageThreadIdHex =  CryptoUtils.u8aToHex(messageId.getMessageThreadId_asU8())
                const message_user_data : MessageUserdata = MessageUserdata.deserializeBinary(message.getAuthorData_asU8())

                console.log("Processing message. Thread id: " + threadIdHex + " Message thread id " + messageThreadIdHex)

                const message_from_local_user: boolean = message_user_data.getSenderPublicKey()!.toString() === local_account.getIdPubKey()!.toString()
                let shared_secret = new Uint8Array(0)
                if (!message_from_local_user) {
                    console.log("message from another user...")
                    const pre_key_id = message_user_data.getRecipientPreKeyId()!
                    const entropy = CryptoUtils.derivePrivateKeySeed(state.account.seed, pre_key_id)
                    const entropy_bytes: Uint8Array = CryptoUtils.hexToU8NoPrefix(entropy)
                    const pre_key_private = subnet_wasm.x22519_static_secret_from_bytes(entropy_bytes)
                    const eph_public_key = message_user_data.getEphPubKey()!.getKey_asU8()
                    shared_secret = subnet_wasm.x25519_diffie_hellman(pre_key_private, eph_public_key)
                } else {
                    console.log("outgoing message....")
                    // try to pull shared secret from store
                    // if failed to find shared secret then handle message this client can't decrypt
                    const id : MessageId = message.getMessageId()!
                    let secret = getOutgoingMessageKeyFrom(outgoing_messages_keys, id)
                    if (!secret) {
                        console.warn("didn't find shared secret for outgoing message in store - in this case there's no decrypted content...")
                    } else {
                        console.log("found shared secret of outgoing message in store")
                        shared_secret = secret
                    }
                }

                // console.log("DH shared secret: " + u8aToHex(shared_secret))
                const enc_data: Uint8Array = message_user_data.getContent_asU8()!
                const content_clear_bytes = CryptoUtils.aes_decrypt_ui8(shared_secret, enc_data)

                const content = MessageContent.deserializeBinary(content_clear_bytes)
                console.log("🔓 message content was decrypted!")

                const subject = new TextDecoder().decode(content.getSubject()!.getData_asU8())
                const body = new TextDecoder().decode(content.getBody()!.getData_asU8())
                console.log("subject: " + subject)
                console.log("body: " + body)
                console.log("thread id: " + threadIdHex);
                console.log("message id: " + messageThreadIdHex);

                console.log("📩 adding message id: " + messageThreadIdHex + ", thread id: " + threadIdHex)
                const thread_with_messages : ThreadWithMessages = threads.get(threadIdHex)!

                const sender_pub_key = message_user_data.getSenderPublicKey()!.getKey_asU8()
                const receiver_pub_key = message_user_data.getRecipientPublicKey()!.getKey_asU8()

                // get the account info for the message's sender
                let sender_account: Account
                let receiver_account: Account
                if (message_from_local_user) {
                    console.log("Message was sent by local user")
                    sender_account = local_account
                    const receiver_id = u8aToHex(receiver_pub_key)
                    receiver_account = all_accounts.get(receiver_id)!
                    if (!receiver_account) {
                        console.error("missing receiver info for id " + receiver_id)
                    }

                } else {
                    console.log("Message was sent by another user to local user")
                    sender_account = all_accounts.get(u8aToHex(sender_pub_key))!
                    receiver_account = local_account
                }

                thread_with_messages.messages.set(messageThreadIdHex, {
                    message: message.getServerData()!,
                    user_data: message_user_data,
                    content: content,
                    sender: sender_account,
                    receiver: receiver_account,
                    thread: thread_with_messages.thread
                })

                const server_data = message.getServerData()!
                if (!server_data.getOpened() && !message_from_local_user) {
                    unread_messages += 1
                }
            } catch (error) {
                console.log("failed to process message: " + error)
            }
        }

        if (boxType === ThreadBoxType.THREAD_BOX_TYPE_INBOX) {
            console.log("📧️ unread inbox messages: " + unread_messages)
            dispatch(setUnreadCount(unread_messages))
        }

        ///////
        // todo: add a message to sort threads and use it for rendering
        // first sort criteria: unread count
        // second sort criteria: send date desc of last incoming message in a thread
        //

        console.log("✨ finished processing box messages")

    } catch (error) {
        console.log("💣 error processing messages: " + error)
    }

    return threads
}
