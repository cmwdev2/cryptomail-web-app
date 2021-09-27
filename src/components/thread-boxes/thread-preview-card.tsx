// @ts-ignore
import React, {useEffect, useState} from 'react'
import {Card, Image, Button, Label, Icon, Divider, Popup} from 'semantic-ui-react'
import {PaidActionType, Payment} from '../../proto/types/types_pb'
import {utils} from "ethers";
import {ThreadWithMessages} from '../../common/types'
import MarkdownPreview from '@uiw/react-markdown-preview'
import DOMPurify from 'dompurify'
import {Account} from '../../proto/types/accounts_pb'
import {max_preview_chars} from '../../common/config'

interface ThreadCardProps {
    thread: ThreadWithMessages, // the thread this card displays with all messages and senders info authenticated and decrypted
    onThreadClicked: (thread: ThreadWithMessages) => void
    localAccount: Account
}

type OptionalPayment = Payment | null

// Thread card displays a thread with messages preview in a card layout
function ThreadPreviewCard(props: ThreadCardProps) {

    // todo: otherUser -> previewUser
    // const [otherUser, setOtherUser] = useState(null as OptionalAccount)
    const [otherUserName, setOtherUserName] = useState("")
    const [otherUserFullName, setOtherUserFullName] = useState("")
    const [otherUserOrg, setOtherUserOrg] = useState("")
    const [otherUserPosition, setOtherUserPosition] = useState("")
    const [otherUserOgRank, setOtherUserOgRank] = useState(0)
    const [otherUserEarnedTokens, setOtherUserEarnedTokens] = useState(0)

    const [otherUserLargeProfileImageUrl, setOtherUserLargePRofileImageUrl] = useState("")
    // const [otherUserSmallProfileImageUrl, setOtherUserSmallPRofileImageUrl] = useState("")


    // const [actionMessageId, setActionMessageId] = useState(0)

    const [preview, setPreview] = useState("")
    const [subject, setSubject] = useState("")

    // const [localUserName, setLocalUserName] = useState("")

    // const location = userInfo.getLocation()
    // const payment_settings = userInfo.getPaymentSettings()

    // payment action - any payment action that was not redeemed
    const [previewPaymentInfo, SetPreviewPaymentInfo] = useState(null as OptionalPayment)

    const [hasUnreadIncomingMessage, setHasUnreadIncomingMessage] = useState(false)

    function setPreviewUser(account: Account) {
        // setOtherUser(account)
        console.log("other account name: " + account.getPublicAccountInfo()!.getName())
        const info = account.getPublicAccountInfo()!
        setOtherUserFullName(DOMPurify.sanitize(info.getFullName()))
        setOtherUserOrg(DOMPurify.sanitize(info.getOrgName()))
        setOtherUserPosition(DOMPurify.sanitize(info.getPosition()))
        setOtherUserName(DOMPurify.sanitize(info.getName()))
        setOtherUserOgRank(account.getReputation()!.getOgRank())
        setOtherUserEarnedTokens(account.getReputation()!.getCmailTokenBalanceTotalEarned())
        setOtherUserLargePRofileImageUrl(info.getProfileImageUrl())

    }

    useEffect(() => {

        // setLocalUserName(local_account.getName())

        // todo: create array of (id, message) sorted by message creation date descending
        // so most recent message is first
        // show payment info if that message has associated payment that wasn't reclaimed

        // sort the messages by date sent descending
        props.thread.messages[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort(([id1,m1], [_,m2]) => m2.user_data.getCreated() - m1.user_data.getCreated());
        }

        let subjectSet = false
        let gotOtherUser = false
        console.log("Number of thread messages: " + props.thread.messages.size)

        for (const [id, message] of props.thread.messages) {

            const pub_key = message.sender.getIdPubKey()!.getKey_asU8()
            console.log("Message id in thread preview: " + id)
            const isIncoming = pub_key.toString() !== props.localAccount.getIdPubKey()!.getKey_asU8().toString()

            console.log("message sender: " + message.sender.getPublicAccountInfo()!.getName())

            if (!message.receiver) {
                console.error("message receiver is missing")
            } else {
                console.log("message receiver: " + message.receiver.getPublicAccountInfo()!.getName())
            }

            if (isIncoming) {
                // the other user of the most recent message in this thread who is not us
                console.log("incoming msg");

                if (!gotOtherUser) {
                    gotOtherUser = true
                    setPreviewUser(message.sender)
                }

                if (id === "0x0000000000000000") {
                    console.log("processing first thread message...")
                    const payment = message.user_data.getPayment()
                    if (payment) { // welcome message is not paid
                        const actionType = payment!.getPaidActionType()
                        if (actionType === PaidActionType.PAID_ACTION_TYPE_OPEN && !message.message.getOpened()) {
                            // local user didn't open this message - show open payment info
                            SetPreviewPaymentInfo(payment)
                        } else if (actionType === PaidActionType.PAID_ACTION_TYPE_REPLY && !message.message.getReplied()) {
                            // local user didn't reply this message pay to reply message - show reply payment info
                            SetPreviewPaymentInfo(payment)
                        }
                    } else {
                        console.log("message has no associated payment")
                    }

                    if (!message.message.getOpened()) {
                        setHasUnreadIncomingMessage(true)
                    }
                }
            } else {
                console.log("outgoing message " + id)
                if (!gotOtherUser) {
                    gotOtherUser = true
                    setPreviewUser(message.receiver)
                }
            }

            if (!subjectSet) {
                subjectSet = true

                // for display - this is th most recent message in this thread
                setSubject(DOMPurify.sanitize(new TextDecoder().decode(message.content.getSubject()!.getData_asU8()).substring(0,max_preview_chars)))

                let previewText = DOMPurify.sanitize(new TextDecoder().decode(message.content.getBody()!.getData_asU8()).substring(0,max_preview_chars))
                if (!previewText.endsWith("..")) {
                    previewText += "..."
                }
                // todo: only short substring and add ... to it....
                setPreview(previewText)
            }
        }
    }, [props.thread, props.localAccount])

    function onCardClicked() {
        console.log("open message card for thread: " + props.thread.thread.getId());
        props.onThreadClicked(props.thread)
    }

    function getUserRankPopupText() {
        return 'This user is OG #' + otherUserOgRank + ' in the first 1,000 cmail OGs'
    }

    // should show last message from other party in this thread
    return (
        <Popup content='Open this message' trigger={
            <Card raised onClick={onCardClicked}>
                {hasUnreadIncomingMessage &&
	                <Label corner color='red' icon='envelope outline'/>
                }

                <Image style={{width: '290px', height: '290px'}}
                       src={otherUserLargeProfileImageUrl}
                       wrapped
                       ui={false}/>
                    { otherUserOgRank < 10000 && <Popup header='OG Rank' content={getUserRankPopupText()} trigger={
                        <Label color='purple' size='huge' corner
                               style={{display: 'flex', opacity: '80%', justifyContent: 'right', alignItems: 'flex-start'}}>
                        <span style={{marginTop: '8px', fontSize: 'small', marginRight: '8px'}}>
                            🎖 {otherUserOgRank.toString()}
                        </span>
                        </Label>
                    }/>}

                <Popup header="Cmail Tokens"
                       content="Total amount of cmail tokens earned by this account."
                       trigger={
                           <Label style={{display:'relative', left:'17px', top:'2px'}} size='tiny' color='red' floating>
                               🪙&nbsp;&nbsp;&nbsp;{otherUserEarnedTokens}</Label>
                       }/>

                <Card.Content>
                    <Card.Header>Conversation with {otherUserName}</Card.Header>
                    <Card.Meta style={{color: '#333333', fontSize: 'smaller', marginTop: '3px'}}>
                        {otherUserFullName.length > 0 && <span><Icon name='user' color='blue'/>{otherUserFullName} <br/></span>}
                        {otherUserOrg.length > 0 && <span><Icon name='building' color='brown'/>{otherUserOrg} <br/></span>}
                        {otherUserPosition.length > 0 && <span><Icon name='users' color='orange'/>{otherUserPosition} <br/></span>}
                    </Card.Meta>
                    <Divider/>
                    <Card.Description>
                        <div style={{color: '#333333', marginBottom: '10px'}}>{subject}</div>
                        <div style={{color: '#000000', fontSize: 'bigger'}}>
                            <MarkdownPreview source={preview} />
                        </div>
                    </Card.Description>
                </Card.Content>

                {previewPaymentInfo !== null && previewPaymentInfo.getPaidActionType() === PaidActionType.PAID_ACTION_TYPE_OPEN &&
                    <Popup header='Get paid for reading'
                           content={otherUserName + ' has paid ' + utils.formatEther(previewPaymentInfo.getAmount()!.getAmount()) + " eth for you to open and read this message. Read it to withdraw the payment."}
                           trigger={
                        <Card.Content extra style={{justifyContent: 'center', display: 'flex'}}>
                            <Button as='div' labelPosition='right' onClick={onCardClicked}>
                                <Button color='blue'>
                                    Open
                                </Button>
                                <Label basic color='blue' pointing='left'>
                                    <Icon name="ethereum"/>
                                    {utils.formatEther(previewPaymentInfo.getAmount()!.getAmount())}&nbsp;ETH
                                </Label>
                            </Button>
                        </Card.Content>
                    }/>
                }

                {previewPaymentInfo !== null && previewPaymentInfo.getPaidActionType() === PaidActionType.PAID_ACTION_TYPE_REPLY &&
                <Popup header='Get paid for replying'
                       content={otherUserName + ' has paid ' + utils.formatEther(previewPaymentInfo.getAmount()!.getAmount()) + " eth for you to open, read and reply to this message."}
                       trigger={
                           <Card.Content extra style={{justifyContent: 'center', display: 'flex'}}>
                               <Button as='div' labelPosition='right' onClick={onCardClicked}>
                                   <Button color='orange'>
                                       Reply
                                   </Button>
                                   <Label basic color='orange' pointing='left'>
                                       <Icon name="ethereum"/>
                                       {utils.formatEther(previewPaymentInfo.getAmount()!.getAmount())}&nbsp;ETH
                                   </Label>
                               </Button>
                           </Card.Content>
                       }/>
                }
            </Card>
        }/>
    )
}

export default ThreadPreviewCard
