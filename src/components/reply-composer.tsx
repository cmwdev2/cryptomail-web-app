 // @ts-ignore
import React, {useEffect, useState} from 'react'
import {
    Button,
    Container,
    Grid,
    GridColumn, Icon,
    Label,
    Message, MessageContent,
    MessageHeader,
    Popup,
    Segment
} from 'semantic-ui-react'
import {useAppSelector} from '../app/hooks'
import {Redirect} from 'react-router'
import {setAccounts} from '../features/public-accounts/public-accounts-slice'
import {
    Compression,
    Keypair, MessageId, MimeType,
    PaidActionType} from '../proto/types/types_pb'
import {base64} from 'ethers/lib/utils'
import {setLastError} from '../features/app/app-slice'
import {useDispatch} from 'react-redux'
import {GetAccountRequest, ReplyResponse} from '../proto/api/api_types_pb'
import UserCard from './user-card'
import {BigNumber, ethers, utils} from 'ethers'

import {TransactionReceipt, TransactionResponse} from '@ethersproject/abstract-provider'

import {etherScanTransactionUrl, format_eth_address} from '../common/time'
import MDEditor from '@uiw/react-md-editor'
import detectEthereumProvider from '@metamask/detect-provider'
import cmailAbiJson from '../features/ethereum/crypto_mail_abi.json'
import getNetConfig, {EthTransactionStatus, productEthChainId} from '../features/ethereum/config'
import {getRootState} from '../app/store'
import CryptoUtils from '../features/crypo/crypto'
import {ContentItem, MessageContent as ApiMessageContent} from '../proto/types/content_pb'
import * as aesjs from 'aes-js'
import {OptionalAccount, OptionalMessageData} from '../common/types'
 import {max_preview_chars} from '../common/config'
 import MessageCard from './thread-boxes/message-card'
 import {replyMessage, ReplyMessageParams} from '../features/messaging/reply-message'
 import {getUniqueMessageId} from '../common/message-id'

interface ReplyComposerProps {
    interactiveMetamaskConnect: () => void
    repliedMessageData: OptionalMessageData
    localAccount: OptionalAccount
}

function ReplyComposer(props: ReplyComposerProps) {
    const dispatch = useDispatch()

    //// Selectors
    //

    const metaMaskLocked = useAppSelector((state) => state.ethereum.account === null)
    const metaMaskAvailable = (typeof window.ethereum !== 'undefined')

    const isUserEthAccountMetamaskUnlocked = useAppSelector((state) => {
        if(props.localAccount === null) {
            return false
        }

        if (state.ethereum.account === null || state.ethereum.account === "0" ) {
            return false
        }
        if (!ethers.utils.isAddress(state.ethereum.account)) {
            return false
        }
        const metamaskAddress = ethers.utils.getAddress(state.ethereum.account)

        const localUserEthAddress = props.localAccount!.getPublicAccountInfo()!.getPaymentSettings()!.getEthAddress()!.getBytes_asU8()
        return format_eth_address(localUserEthAddress) === metamaskAddress
    })

    /// Component State
    //

    const [subject, setSubject] = useState("")

    const [messageText, setMessageText] = useState("This is the message's body. --xxxx")
    const [messageThreadId, setMessageThreadId] = useState(new Uint8Array(8))
    const [localUserEthAddress, setLocalUserEthAddress] = useState("")
    const [replyDepositOnChain, setReplyDepositOnChain] = useState(false)
    const [paidReplyDepositAmount, setPaidReplyDepositAmount] = useState("0")
    // const [paidReplyPrice, setPaidReplyPrice] = useState("0")
    // const [paymentBelowPrice, setPaymentBelowPrice] = useState(false)
    const [depositPayeeAddress, setDepositPayeeAddress] = useState("")

    // withdraw transaction
    const [transactionHash, setTransactionHash] = useState("")
    const [transactionStatus, setTransactionStatus] = useState(EthTransactionStatus.unspecified)
    const withdrawTransactionSubmittedOrConfirmed = transactionStatus === EthTransactionStatus.submitted || transactionStatus === EthTransactionStatus.confirmed

    const [sendInProgress, setSendInProgress] = useState(false)
    const enableReplyButton = props.localAccount !== null && !sendInProgress && messageText.length > 0 && subject.length > 0

    // Set to true if reply was sent to server and it returned no error
    const replySent: boolean = useAppSelector((state) => {
        const data = state.messages.last_replay_response
        if (data === null) {
            return false
        }

        const response : ReplyResponse = ReplyResponse.deserializeBinary(CryptoUtils.hexToU8NoPrefix(data))

        const response_message_id = response.getMessageId()!.getMessageThreadId_asU8()!
        if (messageThreadId.toString() === response_message_id.toString()) {
            if (sendInProgress) {
                setSendInProgress(false)
            }
            return true
        }

        return false
    })

    // todo: if sender make a reply deposit to the original message then update the reply popup
    // and add to display the redeem payment screen after user sends the reply

    /// Component main effect
    //
    useEffect(() => {
        const state = getRootState()

        console.log('compose reply - main effect...')
        document.title = "CMAIL - Reply";
        setLastError(null)
        setAccounts(new Array<string>())
        setSendInProgress(false)

        if (props.localAccount === null) {
            return
        }

        setSubject("Re: " + new TextDecoder()
            .decode(props.repliedMessageData!.content.getSubject()!
                .getData_asU8()).substring(0,max_preview_chars))

        // get up-to-date replied to message user info
        const req = new GetAccountRequest()
        req.setName(props.repliedMessageData!.sender.getPublicAccountInfo()!.getName())
        dispatch(setLastError(null))

        async function preparePaidReplyData() {

            setReplyDepositOnChain(false)
            //setPaymentBelowPrice(false)

            const payment = props.repliedMessageData!.user_data.getPayment()
            let paymentAmount = "0"
            let replyPrice = "0"
            if (payment && payment!.getPaidActionType() === PaidActionType.PAID_ACTION_TYPE_REPLY) {
                paymentAmount = payment!.getAmount()!.getAmount()
                setPaidReplyDepositAmount(paymentAmount)
            }

            const prices = props.repliedMessageData!.receiver.getPublicAccountInfo()!.getPaymentSettings()!.getPaidActionsList()
            for (const price of prices) {
                if (price.getPaidActionType()! === PaidActionType.PAID_ACTION_TYPE_REPLY) {
                    replyPrice = price.getPrice()!.getAmount()
                    break
                }
            }
            // setPaidReplyPrice(replyPrice)

            const price_amount = BigNumber.from(replyPrice)
            // const payment_amount = BigNumber.from(paymentAmount)
            // const payment_below_price = payment_amount.lt(price_amount)
            // setPaymentBelowPrice(payment_below_price)

            if (paymentAmount === "0") {
                // message replied to has no pay to reply
                return
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum as any)
            const chainId = state.ethereum.chainId
            const net_config = getNetConfig(productEthChainId)

            console.log("cmail contract address: " + net_config.contractAddress)
            console.log("chain id: " + chainId)

            const message_id = props.repliedMessageData!.user_data.getMessageId()!
            const contract = new ethers.Contract(net_config.contractAddress, cmailAbiJson, provider)
            const deposit = await contract.getDeposit(getUniqueMessageId(message_id))
            if (!deposit) {
                console.error("failed to get deposit on-chain data")
                setReplyDepositOnChain(false)
            }

            setDepositPayeeAddress(deposit.recipient)

            const amount = deposit.amount
            if (amount.toString() === "0") {
                console.warn("deposit was already withdrawn")
                setReplyDepositOnChain(false)
                return
            }

            console.log("deposit amount from chain: " + utils.formatEther(amount.toString()) + " eth")

            if (amount.toString() !== price_amount.toString()) {
                console.warn("deposit amount different than user's set price")
            }

            const localUserEthAddress = props.localAccount!.getPublicAccountInfo()!.getPaymentSettings()!.getEthAddress()!.getBytes_asU8()
            const userEthAddressStr : string = format_eth_address(localUserEthAddress)
            setLocalUserEthAddress(userEthAddressStr)
            if (deposit.recipient !== userEthAddressStr) {
                console.info("deposit is not for local user eth address")
                console.log("local user eth address: " + userEthAddressStr)
                console.log("recipient address: " + deposit.recipient)
            }

            setReplyDepositOnChain(true)
        }
        preparePaidReplyData().then()

    },[props.repliedMessageData, dispatch, props.localAccount])


    // Component functions
    //

    async function onMakePaymentClicked() {
        try {

            const state = getRootState()

            // reset transaction state
            setTransactionStatus(EthTransactionStatus.unspecified)
            setTransactionHash("")

            if (localUserEthAddress !== depositPayeeAddress) {
                console.warn("deposit payee is not local eth account")
                return
            }

            if (!ethers.utils.isAddress(localUserEthAddress)) {
                console.log("invalid eth receiver address")
                return
            }

            // const toAddressNormalized = ethers.utils.getAddress(userEthAddressStr)
            // double check metamask is the source of window.ethereum
            const metamask_provider = await detectEthereumProvider()
            if (!metamask_provider) {
                return
            }
            if (!isUserEthAccountMetamaskUnlocked) {
                console.log("need valid eth account - please connect metamask")
                return
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum as any)
            const chainId = state.ethereum.chainId
            const signer = provider.getSigner()
            const net_config = getNetConfig(productEthChainId)
            const contract = new ethers.Contract(net_config.contractAddress, cmailAbiJson, signer)

            console.log("cmail contract address: " + net_config.contractAddress)
            console.log("chain id: " + chainId)

            const messageId = props.repliedMessageData!.user_data.getMessageId()!
            const withdrawId = getUniqueMessageId(messageId)

            try {
                let resp : TransactionResponse = await contract.withdraw(withdrawId)
                console.log("tx submitted: " + resp.hash)
                setTransactionStatus(EthTransactionStatus.submitted)
                setTransactionHash(resp.hash)

                // don't wait for transaction receipt
                /*
                const receipt: TransactionReceipt = await resp.wait(1)
                console.log("tx receipt: " + receipt.transactionHash)
                setTransactionStatus(EthTransactionStatus.confirmed)
                 */

            } catch (err : any) {
                if (err.code === 4001) {
                    console.log("local user rejected the transaction in metamask")
                    setTransactionStatus(EthTransactionStatus.userRejected)
                } else {
                    setTransactionStatus(EthTransactionStatus.error)
                }
                console.log("tx error: " + err)
            }
        } catch (error) {
            console.log("error making a withdraw: ", error)
            setTransactionStatus(EthTransactionStatus.error)
        }
    }

    // send the local user's reply
    async function onSendReplyClicked() {
        console.log("send reply clicked...")

        if (props.localAccount === null) {
            return
        }

        const state = getRootState()

        const key_pair_data = state.account.key_pair
        if (key_pair_data === null) {
            console.log("missing user key pair")
            return
        }

        const key_pair = Keypair.deserializeBinary(base64.decode(key_pair_data))

        const body = new ContentItem()
        body.setMimeType(MimeType.MIME_TYPE_TEXT_MD)
        body.setData(aesjs.utils.utf8.toBytes(messageText))
        body.setCompression(Compression.COMPRESSION_UNCOMPRESSED)

        const subjectItem = new ContentItem()
        subjectItem.setMimeType(MimeType.MIME_TYPE_TEXT_UTF8)
        subjectItem.setData(aesjs.utils.utf8.toBytes(subject))
        subjectItem.setCompression(Compression.COMPRESSION_UNCOMPRESSED)

        const content = new ApiMessageContent()
        content.setBody(body)
        content.setSubject(subjectItem)

        const thread = props.repliedMessageData!.thread
        const messageId = new MessageId()
        const message_thread_id = CryptoUtils.randomBytes(8)
        messageId.setMessageThreadId(message_thread_id)
        messageId.setThreadId(thread.getId_asU8())
        setMessageThreadId(message_thread_id)

        const params : ReplyMessageParams = {
            sender: props.localAccount!,
            sender_key_pair: key_pair, // sender account key pair
            content: content, // unencrypted yet
            receiver: props.repliedMessageData!.sender!,
            message_id: messageId,
            thread: thread,
            reply_to: props.repliedMessageData!.user_data.getMessageId()!.getMessageThreadId_asU8()
        }

        console.log("created new reply call data - calling sendNewReply()....")

        setSendInProgress(true)
        dispatch(replyMessage(params))
    }

    function getReplyPopupText() : string {
        if (!replyDepositOnChain) {
            return 'Send this reply'
        }

        return 'Send this reply. You will be prompted to withdraw the ' + utils.formatEther(paidReplyDepositAmount) + ' eth payment once you have sent it.'
    }

    function onCloseClicked() {
        setReplyDepositOnChain(false)
    }

    // todo: show last error - in case send failed. setSendInProgress(false)

    // Rendering
    //

    if (props.localAccount === null || (replySent && !replyDepositOnChain) || props.repliedMessageData === null) {
        // if no user or reply was sent and there's no payment to withdraw then close this reply composer
        return <Redirect to='/'/>
    }

    return (
    <Grid style={{marginTop:'10px', paddingBottom:'36px'}}>
        <GridColumn width={11}>
            <Container style={{ paddingTop: '0px', opacity: '85%', paddingLeft:'20px', textAlign:'left' }}>
                <Message attached>
                  <Message.Header>Compose a new reply</Message.Header>
                </Message>
                <Segment attached>
                    <Popup content="Enter the message's receiver cmail user name. e.g. @admin or subnetter1" trigger={
                        <div style={{marginBottom:'20px'}}>
                            <Label color='yellow' ribbon>To</Label>
                            <div> {props.repliedMessageData!.sender.getPublicAccountInfo()!.getName()}</div>
                        </div>
                    } />
                    <span>
                        <Label color='yellow' ribbon>Subject</Label>
                        <div>{subject}</div>
                    </span>
                    <Container style={{marginTop:'20px'}}>
                        <Label color='yellow' ribbon>Message</Label>
                    <MDEditor
                        value={messageText}
                        height={200}
                        onChange={ (v) => {
                            if (v !== null) {
                                setMessageText(v!)
                            }
                        }}
                    />
                    </Container>
                </Segment>
                <Segment attached>
                    <Grid columns="equal">
                        <Grid.Column stretched width={12}>
                            { replySent && replyDepositOnChain && !metaMaskAvailable &&
                                <Message info>
                                    <MessageHeader>
                                        🦊&nbsp;&nbsp; Metamask is not available
                                    </MessageHeader>
                                    <MessageContent style={{marginTop: '10px'}}>
                                        To make a payment please enable it and unlock it for this website.
                                    </MessageContent>
                                </Message>
                            }


                            { replySent && replyDepositOnChain && metaMaskAvailable && metaMaskLocked &&
                                <Message>
                                    <MessageHeader>
                                        🦊&nbsp;&nbsp; Metamask locked
                                    </MessageHeader>
                                    <MessageContent style={{marginTop: '10px'}}>
                                        To make a payment please enable it and unlock it for this website.
                                        <div style={{marginTop: '10px'}}>
                                            <Button basic color='blue' as='a' onClick={() => props.interactiveMetamaskConnect()}>Unlock Metamask</Button>
                                        </div>
                                    </MessageContent>
                                </Message>
                            }
                            { replySent && replyDepositOnChain && metaMaskAvailable && !metaMaskLocked && !isUserEthAccountMetamaskUnlocked &&
                                <Message error>
                                    <MessageHeader>
                                        🦊&nbsp;&nbsp; Wrong Ethereum Account
                                    </MessageHeader>
                                    <MessageContent style={{marginTop: '10px'}}>
                                        Please select your cmail Ethereum account {localUserEthAddress} in Metamask.
                                    </MessageContent>
                                </Message>
                            }

                            { replySent && replyDepositOnChain && !metaMaskLocked
                                && isUserEthAccountMetamaskUnlocked && localUserEthAddress !== depositPayeeAddress &&
                                <Message info>
                                    <MessageContent>
                                        👋&nbsp;&nbsp;Please select account {depositPayeeAddress} in MetaMask
                                    </MessageContent>
                                </Message>
                            }

                            { replySent && replyDepositOnChain && !withdrawTransactionSubmittedOrConfirmed && metaMaskAvailable && !metaMaskLocked && isUserEthAccountMetamaskUnlocked &&
	                            <div style={{marginTop: '10px'}}>🦊&nbsp;&nbsp; Metamask unlocked and connected.</div>
                            }

                            { !replySent && replyDepositOnChain && paidReplyDepositAmount !== "0" &&
                                <Message info>
                                    <MessageContent>
	                                    👋&nbsp;&nbsp;Send your reply to withdraw a reply payment of {utils.formatEther(paidReplyDepositAmount)} eth.
                                    </MessageContent>
                                </Message>
                            }

                            { transactionStatus === EthTransactionStatus.userRejected &&
                                <Message error>
                                    <MessageHeader>
                                        Transaction Rejected
                                    </MessageHeader>
                                    <MessageContent style={{marginTop: '10px'}}>
                                        You rejected the withdraw transaction in metamask. Please try again.
                                    </MessageContent>
                                </Message>
                            }
                            { transactionStatus === EthTransactionStatus.error &&
                                <Message error>
                                    <MessageHeader>
                                        Transaction Error
                                    </MessageHeader>
                                    <MessageContent style={{marginTop: '10px'}}>
	                                    Withdraw transaction error. Please check the transaction in MetaMask.
                                    </MessageContent>
                                </Message>
                            }
                            {transactionStatus === EthTransactionStatus.submitted &&
	                        <Message info>
		                        <MessageHeader>
			                        Withdraw Transaction Submitted
		                        </MessageHeader>
		                        <MessageContent style={{marginTop: '10px'}}>
			                        <a target='_blank' rel='noreferrer' href={etherScanTransactionUrl(transactionHash)}>Transaction Details</a>
		                        </MessageContent>
	                        </Message>
                            }

                            {transactionStatus === EthTransactionStatus.confirmed &&
                                <Message success>
                                    <MessageHeader>
	                                    Withdraw Transaction Confirmed
                                    </MessageHeader>
                                    <MessageContent style={{marginTop: '10px'}}>
                                        <a target='_blank' rel='noreferrer' href={etherScanTransactionUrl(transactionHash)}>Transaction Details</a>
                                    </MessageContent>
                                </Message>
                            }

                        </Grid.Column>
                        <Grid.Column textAlign='right'>
                            {replySent && replyDepositOnChain && !withdrawTransactionSubmittedOrConfirmed && paidReplyDepositAmount.toString() !== "0" &&
	                        <Popup header='Collect Payment'
	                               content='Execute a smart contract transaction using Metamask to receive the payment for replying to this message.'
	                               trigger={
                                       <Button as='div' labelPosition='right' onClick={(_) =>
                                           onMakePaymentClicked()}>
                                           <Button color='orange'>
                                               Reply Payment
                                           </Button>
                                           <Label basic color='orange' pointing='left'>
                                               <Icon name="ethereum"/>
                                               {utils.formatEther(paidReplyDepositAmount)} ETH
                                           </Label>
                                       </Button>
                                   }/>
                            }
                            {!replySent && <Popup content={getReplyPopupText()}
	                               trigger={
                                       <Button color='blue' onClick={(_) => onSendReplyClicked()} disabled={!enableReplyButton}>
                                           <Icon name='send'/>
                                           Send
                                           <Label style={{top:'-20px', position:'relative', left:'30px', color: 'white'}} size='tiny' color='red' floating>+100</Label>
                                       </Button>
                                   }/>
                            }
                            {replySent && withdrawTransactionSubmittedOrConfirmed && <Button
                                    content='Close'
                                    icon='close'
                                    labelPosition='left'
                                    onClick={(_) => onCloseClicked()}
                                    basic
                                />
                            }
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Container>
            <Container style={{ paddingTop: '0px', opacity: '85%', marginTop:'20px', paddingLeft:'20px', textAlign:'left' }}>
		        <Message attached>
			        <MessageHeader>
				        Original Message
			        </MessageHeader>
                </Message>
                <Segment attached>
	                <MessageCard
                        localAccount={props.localAccount!}
                        showCommands={false}
		                replyToMessageAction={(_) => {}}
		                interactiveMetamaskConnect={props.interactiveMetamaskConnect}
		                message={props.repliedMessageData!}/>
                </Segment>
            </Container>
        </GridColumn>
        <GridColumn width={5} style={{opacity: '85%', paddingRight:'30px'}}>
           <UserCard user={props.repliedMessageData!.sender!} clickable={false}/>
        </GridColumn>
    </Grid>)
}

export default ReplyComposer
