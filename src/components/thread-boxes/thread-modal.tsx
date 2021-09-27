// @ts-ignore
import React, {useEffect, useState} from 'react'
import {
    Button,
    Modal,
    Grid,
    GridColumn,
    Icon,
    GridRow, Popup, ModalHeader
} from 'semantic-ui-react'
import {Keypair} from '../../proto/types/types_pb'
import {getRootState} from '../../app/store'
import {base64} from 'ethers/lib/utils'
import UserCard from '../user-card'
import MessageCard from './message-card'
import {u8aToHex} from '@polkadot/util'
import {archiveThread} from '../../features/messaging/archive-thread'
import {ThreadBoxType} from '../../proto/types/content_pb'
import {useDispatch} from 'react-redux'
import {ArchiveThreadResponse} from '../../proto/api/api_types_pb'
import CryptoUtils from '../../features/crypo/crypto'
import {setArchiveThreadResponse} from '../../features/messaging/messaging-slice'
import {MessageData, OptionalAccount, ThreadWithMessages} from '../../common/types'
import DOMPurify from 'dompurify'
import {Account} from '../../proto/types/accounts_pb'

interface ThreadModalProps {
    onCloseButtonClicked: () => void
    interactiveMetamaskConnect: () => void
    thread: ThreadWithMessages, // the thread this card displays with all messages and senders info authenticated and decrypted
    thread_box_type: number
    replyToMessageAction: (data: MessageData) => void
    localAccount: Account
}

// Thread card displays a thread with messages preview in a card layout
function ThreadModal(props: ThreadModalProps) {

    const dispatch = useDispatch()
    const state = getRootState()

    // user info for the preview card - it is the other thread user unless this the thread only contains a sent message by local user
    // in that case, the info is the local user info
    const [userInfo, setUserInfo] = useState(null as OptionalAccount)
    const [otherUserName, setOtherUserName] = useState("")

    const isInbox = props.thread_box_type === ThreadBoxType.THREAD_BOX_TYPE_INBOX

    function onArchiveClicked() {

        if (props.localAccount === null) {
            return
        }

        const local_user_info = props.localAccount.getPublicAccountInfo()!
        const key_pair_data = state.account.key_pair
        if (key_pair_data === null) {
            console.warn("missing user key pair")
            return
        }
        const key_pair = Keypair.deserializeBinary(base64.decode(key_pair_data))
        const params = {
            local_user: local_user_info,
            local_user_key_pair: key_pair, // local user account key pair
            thread_id: props.thread.thread.getId_asU8(), // 8 bytes - sender provided
        }

        dispatch(archiveThread(params))
    }

    // list on last archive action result
    useEffect(() => {

        console.log("threadbox modal archive action handler")

        const data = state.messages.last_archive_thread_response
        if (data === null) {
            return
        }

        const resp : ArchiveThreadResponse = ArchiveThreadResponse.deserializeBinary(CryptoUtils.hexToU8NoPrefix(data))

        if (resp.getThreadId()!.getId_asU8().toString() === props.thread.thread.getId_asU8().toString()) {

            // we handled it so we should clean up
            dispatch(setArchiveThreadResponse(null))

            // close this modal
            props.onCloseButtonClicked()
        }

        // check archive result - if it is for this thread then close self so user is back in inbox
    }, [dispatch, state.messages.last_archive_thread_response, props])

    useEffect(() => {

        console.log("thread model main effect")

        // sort the messages by date sent descending so we always display last message first
        props.thread.messages[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort(([id1,m1], [_,m2]) => m2.user_data.getCreated() - m1.user_data.getCreated());
        }

        // We go through the message to find the user info we want to display for this thread
        // It will be the info of the last message sender or receiver which is not the local user
        // or the local user if there's only messages from him... (e.g. sent items)
        let userFound = false
        // let subjectSet = false
        const local_account_key = props.localAccount.getIdPubKey()!.getKey_asU8()
        for (const [id, message] of props.thread.messages) {
            const pub_key = message.sender.getIdPubKey()!.getKey_asU8()
            console.log("Sender pub key: " + u8aToHex(pub_key))
            if (pub_key.toString() !== local_account_key.toString()) {
                userFound = true
                // the other user of the most recent message in this thread who is not us
                console.log("User msg " + id + " sender is " + message.sender.getPublicAccountInfo()!.getName() + " as other thread user")
                setUserInfo(message.sender)
                setOtherUserName(DOMPurify.sanitize(message.sender.getPublicAccountInfo()!.getName()))
                break
            }

            const receiver_pub_key = message.receiver.getIdPubKey()!.getKey_asU8()
            console.log("Receiver pub key: " + u8aToHex(receiver_pub_key))
            if (receiver_pub_key.toString() !== local_account_key.toString()) {
                userFound = true
                // the other user of the most recent message in this thread who is not us
                console.log("User msg " + id + " receiver is " + message.receiver.getPublicAccountInfo()!.getName() + " as other thread user")
                setUserInfo(message.receiver)
                setOtherUserName(DOMPurify.sanitize(message.receiver.getPublicAccountInfo()!.getName()))
                break
            }
            /*
            if (!subjectSet) {
                subjectSet = true

                // for display - this is th most recent message in this thread
                setSubject(new TextDecoder().decode(message.content.getSubject()!.getData_asU8()).substring(0,max_preview_chars))
            }*/
        }
        // handle case where there's only 1 message sent from local user. e.g. sent items w/o a reply
        if (!userFound) {
            setUserInfo(props.localAccount)
        }

    }, [props.thread, props.localAccount])


    function onCloseClicked() {
        props.onCloseButtonClicked()
    }

    // should show last message from other party in this thread
    // we only display modal header if the thread has more than 1 message as the message displayed may
    // have a different subject than the thread's subject.
    return (
        <Modal style={{width:'100%', opacity:'90%'}} size='fullscreen' open={true} closeIcon onClose={() => onCloseClicked()}>
            <ModalHeader>
                Conversation with {otherUserName}
            </ModalHeader>
            <Modal.Content style={{background:'#f3f3f3'}}>
                <Grid columns={2} divided>
                    <GridColumn width={4}>
                        <UserCard user={userInfo!} clickable={false}/>
                    </GridColumn>
                    <GridColumn width={11}>
                        {
                            [...props.thread.messages.entries()].map(([k,m]) =>
                            <GridRow key={k.toString()} style={{marginBottom:'10px'}}>
                                <MessageCard
                                    localAccount={props.localAccount}
                                    showCommands={true}
                                    replyToMessageAction={props.replyToMessageAction}
                                    interactiveMetamaskConnect={props.interactiveMetamaskConnect}
                                    message={m}/>
                            </GridRow>)
                        }
                    </GridColumn>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                { isInbox &&
                    <Popup header='Archive Thread' content='Move this thread from your inbox to the archive' trigger={
                        <Button basic color='red' onClick={(_) => {
                            onArchiveClicked()
                        }}>
                            <Icon name="archive"/>Archive</Button>
                    }/>
                }
            </Modal.Actions>
        </Modal>
    )
}

export default ThreadModal
