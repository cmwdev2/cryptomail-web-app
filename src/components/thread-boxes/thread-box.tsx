// @ts-ignore
import React from 'react'
import './thread-box.css'
import {Card, Container} from 'semantic-ui-react'
import {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../app/hooks'
import {
    ThreadBoxType
} from '../../proto/types/content_pb'
import {Keypair} from '../../proto/types/types_pb'

import {createGetThreadBoxesRequest, getAccountAndThreadBoxesAction} from '../../features/account/get-account-and-boxes-api'
import {getRootState} from '../../app/store'
import {base64} from 'ethers/lib/utils'
import {Redirect} from 'react-router'
import ThreadPreviewCard from './thread-preview-card'
import ThreadModal from './thread-modal'
import {MessageData, OptionalAccount, OptionalThread, ThreadWithMessages} from '../../common/types'
import {getThreadBoxData} from '../../features/messaging/get-threadbox-data'

interface ThreadboxProps {
    boxType: number
    interactiveMetamaskConnect: () => void
    replyToMessageAction: (data: MessageData) => void
    localAccount: OptionalAccount
}

// A thread-box display screen configured to display messages from 1 thread-box. e.g. inbox, archive, sent items...
function ThreadboxScreen(props: ThreadboxProps) {
    const dispatch = useAppDispatch()

    // const unreadCount = useAppSelector((state) => state.messages.unread_count)

    const threadBoxes = useAppSelector((state) => state.messages.thread_boxes)

    useEffect(() => {

        if (props.localAccount === null) {
            return
        }

        console.log("thread-box main effect")

        function getTitle() : string {
            switch (props.boxType) {
                case ThreadBoxType.THREAD_BOX_TYPE_INBOX: return "Inbox"
                case ThreadBoxType.THREAD_BOX_TYPE_SENT: return "Sent"
                case ThreadBoxType.THREAD_BOX_TYPE_ARCHIVE: return "Archive"
            }
            return "Messages"
        }
        const title = getTitle()
        document.title = "CMAIL - " + title
        console.log("📬 viewing thread-box: " + title)
    }, [props.boxType, props.localAccount])

    // all inbox threads and content indexed by thread ids (hex string)
    const [threads, setThreads] = useState(new Map<string, ThreadWithMessages>())

    // all account infos of other users in threads indexed by public keys (hex string)
    // const [accountInfos, setAccountInfos] = useState(new Map<string, PublicAccountInfo>())

    useEffect( () => {
        if (props.localAccount === null) {
            return
        }

        console.log("Getting threadbox data...")
        getThreadBoxData(props.boxType, dispatch).then ((res) => {
            console.log("Got threadbox data - setting threads. Got # threads: " + res.size)
            setThreads(res)
        })

    }, [threadBoxes, props.boxType, props.localAccount, dispatch])

    useEffect(() => {

        if (props.localAccount === null) {
            return
        }

        const key_pair_data = getRootState().account.key_pair
        if (key_pair_data === null) {
            console.log("account key pair is null")
            return
        }

        // todo: only do this if last thread box read was not too soon
        console.log("****** Getting updated user account info, thread-boxes, threads and messages from the server...")
        const key_pair = Keypair.deserializeBinary(base64.decode(key_pair_data))
        // console.log("Account public key: 0x" + CryptoUtils.u8aToHexNoPrefix(key_pair.getPublicKey_asU8()))
        // console.log("Account private key: 0x" + CryptoUtils.u8aToHexNoPrefix(key_pair.getPrivateKey_asU8()))
        const request = createGetThreadBoxesRequest(key_pair, props.boxType)

        console.log("Thread-box(es) type to get from server: " + props.boxType)
        dispatch(getAccountAndThreadBoxesAction(request))

    }, [dispatch, props.boxType, props.localAccount])

    const [openThread, setOpenThread] = useState(null as OptionalThread)

    function onCloseThreadModel() {
        setOpenThread(null)
    }

    function onThreadPreviewClicked(thread: ThreadWithMessages) {
        setOpenThread(thread)
    }

    if (props.localAccount === null) {
        return <Redirect to='/'/>
    }

    return (
      <Container style={{marginTop:'14px', padding: '10px', opacity: '80%', textAlign:'left', width:'100%'}}>
          { openThread !== null &&
            <ThreadModal
                replyToMessageAction={props.replyToMessageAction}
                interactiveMetamaskConnect = {props.interactiveMetamaskConnect}
                onCloseButtonClicked={onCloseThreadModel}
                key={openThread!.thread.getId().toString()}
                thread={openThread!}
                localAccount={props.localAccount}
                thread_box_type={props.boxType}
            />
          }

          <Card.Group style={{width:'100%', justifyContent:'space-between'}}>
              {[...threads.entries()].map(([k,t]) =>
                  <ThreadPreviewCard
                      localAccount={props.localAccount!}
                      onThreadClicked={onThreadPreviewClicked} key={k.toString()} thread={t}/>)}
           </Card.Group>
      </Container>
    )
}

export default ThreadboxScreen
