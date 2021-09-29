 // @ts-ignore
import React, {useEffect, useState} from 'react'
import {
    Button,
    Container,
    Form,
    FormInput,
    Grid,
    GridColumn,
    Icon,
    Label,
    Message,
    MessageContent,
    MessageHeader,
    Popup,
    Segment
} from 'semantic-ui-react'
import {useAppSelector} from '../app/hooks'
import {Redirect, useLocation} from 'react-router'
import {setAccounts} from '../features/public-accounts/public-accounts-slice'
import {
    Amount, Compression,
    Keypair, MessageId, MimeType,
    PaidActionType,
    PaidActionTypeMap,
    Payment,
    Token
} from '../proto/types/types_pb'
import {base64} from 'ethers/lib/utils'
import {OptionalAppError, setLastError} from '../features/app/app-slice'
import {getPublicAccountInfoAction} from '../features/public-accounts/public-accounts-server-api'
import {useDispatch} from 'react-redux'
import {GetAccountRequest, NewThreadResponse, NewThreadResult} from '../proto/api/api_types_pb'
import UserCard from './user-card'
import {BigNumber, ethers, utils} from 'ethers'
import {TransactionReceipt, TransactionResponse} from '@ethersproject/abstract-provider'
import {etherScanTransactionUrl, format_eth_address} from '../common/time'
import {u8aToHex} from '@polkadot/util'
import MDEditor from '@uiw/react-md-editor'
import detectEthereumProvider from '@metamask/detect-provider'
import cmailAbiJson from '../features/ethereum/crypto_mail_abi.json'
import getNetConfig, {EthTransactionStatus, productEthChainId} from '../features/ethereum/config'
import {getRootState} from '../app/store'
import CryptoUtils from '../features/crypo/crypto'
import {newThread, SendNewThreadParams} from '../features/messaging/new-thread'
import {ContentItem, MessageContent as ApiMessageContent} from '../proto/types/content_pb'
import * as aesjs from 'aes-js'
import {OptionalAccount} from '../common/types'
 import {Account} from '../proto/types/accounts_pb'
 import {formatWeiAmount} from '../features/ethereum/utils'

interface NewThreadComposerProps {
    interactiveMetamaskConnect: () => void
    localAccount: OptionalAccount
}

function NewThreadComposer(props: NewThreadComposerProps) {
    const dispatch = useDispatch()
    //// Selectors
    //
    const metaMaskLocked = useAppSelector((state) => state.ethereum.account === null)
    const metaMaskAvailable = (typeof window.ethereum !== 'undefined')

    function userEthAddress() : Uint8Array {
        if (props.localAccount === null) {
            return new Uint8Array(20)
        }

        if (!props.localAccount.getPublicAccountInfo()!.getPaymentSettings()) {
            console.warn("missing payment info for local user")
            return new Uint8Array(20)
        }

        return props.localAccount.getPublicAccountInfo()!.getPaymentSettings()!.getEthAddress()!.getBytes_asU8()
    }

    const userEthAddressStr : string = format_eth_address(userEthAddress())

    const isUserEthAccountMetamaskUnlocked = useAppSelector((state) => {
        if (state.ethereum.account === null || state.ethereum.account === "0" ) {
            return false
        }
        if (!ethers.utils.isAddress(state.ethereum.account)) {
            return false
        }
        const metamaskAddress = ethers.utils.getAddress(state.ethereum.account)
        const userAddress = ethers.utils.getAddress(u8aToHex(userEthAddress()))
        return userAddress === metamaskAddress
    })

    const serverError : OptionalAppError = useAppSelector((state) => state.app.last_error)
    const toAccount : OptionalAccount  = useAppSelector((state) => {
        const accounts = state.pub_accounts.accounts
        if (accounts.length === 1) {
            return Account.deserializeBinary(base64.decode(accounts[0]))
        }
        return null
    })

    /// Component State
    //
    const [toName, setToName] = useState("")
    const [initialized, setInitialized] = useState(false)
    const [subject, setSubject] = useState("Please help me out on this...")
    const [messageText, setMessageText] = useState("This is the message's body. --xxxx")
    const [threadId] = useState(CryptoUtils.randomBytes(8))
    const [messageId] = useState(new Uint8Array(8))
    const [transactionHash, setTransactionHash] = useState("")
    const [transactionAction, setTransactionAction] = useState(PaidActionType[PaidActionType.PAID_ACTION_TYPE_UNSPECIFIED])
    const [transactionValue, setTransactionValue] = useState(BigNumber.from(0)) // user may have paid above ask price!
    const [transactionStatus, setTransactionStatus] = useState(EthTransactionStatus.unspecified)
    // const [localUserEthAddress, setLocalUserEthAddress] = useState("")

    const paymentTransactionSubmittedOrConfirmed = transactionStatus === EthTransactionStatus.submitted || transactionStatus === EthTransactionStatus.confirmed
    const displayAccountError = toName.length > 0 && toAccount === null && serverError !== null
    const toFieldIconName = toAccount === null ? "" : "checkmark"

    // new thread or reply send in progress
    const [sendInProgress, setSendInProgress] = useState(false)
    const enableSendButton = props.localAccount !== null && !sendInProgress && toAccount !== null && paymentTransactionSubmittedOrConfirmed && messageText.length > 0 && subject.length > 0
    const [subjectError, setSubjectError] = useState(false)

    const lastNewThreadResponseState: NewThreadResponse | null = useAppSelector((state) => {
        const data = state.messages.last_new_thread_response
        if (data === null) {
            return null
        }

        console.log("hex thread response data:" + data)
        if (sendInProgress) {
            setSendInProgress(false)
        }

        const res : NewThreadResponse = NewThreadResponse.deserializeBinary(CryptoUtils.hexToU8NoPrefix(data))
        return res
    })

    console.log("thread id: " + CryptoUtils.u8aToHex(threadId))

    // todo: if sender make a reply deposit to the original message then update the reply popup
    // and add to display the redeem payment screen after user sends the reply

    /// Component main effect
    //

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    const query = useQuery()

    useEffect(() => {
        if (initialized) {
            return
        }

        console.log('compose - main effect...')
        document.title = "CMAIL - New Message";
        setLastError(null)
        setAccounts(new Array<string>())
        setSendInProgress(false)
        const toAccount = query.get('to')
        if (toAccount !== null) {
            setToName(toAccount)
        }

        setInitialized(true)
        // eslint-disable-next-line
    },[query])


    // Component functions
    //
    function showNewThreadSendErrorMessage() : boolean {
        if (lastNewThreadResponseState === null) {
            return false
        }

        return lastNewThreadResponseState.getResult() !== NewThreadResult.NEW_THREAD_RESULT_CREATED;
    }

    function getNewThreadSendErrorMessage() : string {
        if (lastNewThreadResponseState === null) {
            return ""
        }

        switch (lastNewThreadResponseState.getResult()) {
            case NewThreadResult.NEW_THREAD_RESULT_CREATED:
                return ""

            case NewThreadResult.NEW_THREAD_RESULT_INVALID_TX:
                return "Invalid payment transaction."

            case NewThreadResult.NEW_THREAD_RESULT_INVALID_RECEIVER_ACCOUNT:
                return "Recipient account doesn't exist. Please check account name."

            case NewThreadResult.NEW_THREAD_RESULT_INVALID_THREAD_ID:
                return "Invalid thread id. It must be unique and random"

            case NewThreadResult.NEW_THREAD_RESULT_INVALID_SIG:
                return "Invalid signature"

            case NewThreadResult.NEW_THREAD_RESULT_INVALID_TIME_STAMP:
                return "Invalid time stamp"

            default:
                return ""
        }
    }

    function getNewThreadCreated() : boolean {
        if (lastNewThreadResponseState === null) {
            return false
        } else {

            const code = lastNewThreadResponseState.getResult()
            console.log("lastThreadResponse code: " + code)

            if (code !== NewThreadResult.NEW_THREAD_RESULT_CREATED) {
                return false
            }

            const message_id = lastNewThreadResponseState.getMessageId()!
            if (message_id == null) {
                return false
            }

            const thread_id = message_id.getThreadId_asU8()
            console.log("Thread id from response: " + u8aToHex(thread_id))
            if (thread_id.toString() === threadId.toString()) {
                console.log("✨✨✨ thread created")
                return true
            }

            console.warn("unexpected thread id returned by server")
        }

        return false
    }

    // todo: listen on messages slice last sent thread_id+message and redirect to inbox of thread was sent!

    // const userShortEthAddressStr: string = short_format_eth_address(userEthAddress)
    // const metaMaskAccount = useAppSelector((state) => state.ethereum.account)
    // const metamaskEthAccount = useAppSelector((state) => state.ethereum.account)
    // console.log('User eth account: ' + userEthAddressStr)
    // console.log('Metamask locked: ' + metaMaskLocked)
    // console.log('Metamask unlocked account: ' + metaMaskAccount)

    function onToNameFocusOut() {
        dispatch(setAccounts(new Array<string>()))
        if (toName.length > 0) {
            const req = new GetAccountRequest()
            req.setName(toName)
            dispatch(setLastError(null))
            dispatch(getPublicAccountInfoAction(req))
        }
    }

    function onToNameFocusIn() {
        dispatch(setLastError(null))
    }

    function onSubjectFocusOut() {
       setSubjectError(subject.length === 0)
    }

    function onSubjectFocusIn() {
        setSubjectError(false)
    }

    function getToUserOpenPrice(): string {
        if (toAccount === null) return "0"
        const prices = toAccount.getPublicAccountInfo()!.getPaymentSettings()!.getPaidActionsList()
        for (const price of prices) {
            if (price.getPaidActionType()! === PaidActionType.PAID_ACTION_TYPE_OPEN) {
                // console.log("To user open price: " + price.getPrice()!.getAmount())
                return price.getPrice()!.getAmount()
            }
        }
        return "0"
    }

    function getToUserReplyPrice(): string {
        if (toAccount === null) return "0"
        const prices = toAccount.getPublicAccountInfo()!.getPaymentSettings()!.getPaidActionsList()
        for (const price of prices) {
            if (price.getPaidActionType()! === PaidActionType.PAID_ACTION_TYPE_REPLY) {
                // console.log("To user reply price: " + price.getPrice()!.getAmount())
                return price.getPrice()!.getAmount()
            }
        }
        return "0"
    }

    function getErrorMessage() {
        if (displayAccountError) {
            return <Message error
                            header="Unknown Account"
                            content={'There is no cmail user named ' + toName + '. To send a message to someone on cmail you must have their account name. Please check the account name you entered and try again.'}/>
        }
        return null
    }

    function getPayToOpenPopupText() {
        return 'Pay ' + toName + ' to open and read your message. You make a deposit for the open amount to the cmail smart contract. ' +
            toName + ' can withdraw it after reading your message. If he doesn\'t do so then you can refund the amount back. Learn more...';
    }

    function getPayToReplyPopupText() {
        return 'Pay ' + toName + ' to read and reply your message. You make a deposit for the open reply to the cmail smart contract. ' +
            toName + ' can withdraw it after replying to your message. If he doesn\'t do so you can refund the amount back. Learn more...';
    }

    function getPaymentSummaryText() {
        let res = toName + " asks for " + formatWeiAmount(getToUserOpenPrice()) + " to open and read your message"
        if (getToUserReplyPrice() !== "0") {
            res += ", or for " + formatWeiAmount(getToUserReplyPrice()) + " to read and reply to your message"
        }
        return res + "."
    }

    async function onMakePaymentClicked(action: PaidActionTypeMap[keyof PaidActionTypeMap]) {
        try {
            const state = getRootState()
            if (typeof window.ethereum === 'undefined') {
                console.log("Metamask provider not available")
                return
            }
            if (toAccount === null) {
                console.log("missing receiver account info")
                return
            }
            const paymentSettings = toAccount.getPublicAccountInfo()!.getPaymentSettings()
            if (paymentSettings === null) {
                console.log("missing receiver payment settings")
                return
            }
            const receiverEthAddress = paymentSettings!.getEthAddress()
            if (receiverEthAddress === null) {
                console.log("missing receiver payment address")
                return
            }
            // reset transaction state
            setTransactionStatus(EthTransactionStatus.unspecified)
            setTransactionHash("")
            const toAddress = receiverEthAddress!.getBytes_asU8()
            const toAddressStr = "0x" + CryptoUtils.u8aToHexNoPrefix(toAddress)
            if (!ethers.utils.isAddress(toAddressStr)) {
                console.log("invalid eth receiver address")
                return
            }
            const toAddressNormalized = ethers.utils.getAddress(toAddressStr)
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

            console.log("cmail contract address: " + net_config.contractAddress)
            console.log("chain id: " + chainId)
            console.log("thread id: " + threadId)
            console.log("message id: " + messageId)

            const depositId = new Uint8Array(16)
            depositId.set(threadId, 0)
            depositId.set(messageId, 8)
            console.log("deposit id: " + depositId)
            const priceStr = action === PaidActionType.PAID_ACTION_TYPE_OPEN ? getToUserOpenPrice() : getToUserReplyPrice()
            const price = BigNumber.from(priceStr)
            setTransactionAction(action)
            console.log("action:" + action)
            console.log("Transaction action: " + transactionAction)
            const contract = new ethers.Contract(net_config.contractAddress, cmailAbiJson, signer)

            try {
                let resp : TransactionResponse = await contract.deposit(toAddressNormalized, depositId, {value: price})
                console.log("submitted: " + resp.hash)
                setTransactionStatus(EthTransactionStatus.submitted)
                setTransactionHash(resp.hash)
                setTransactionValue(resp.value) // user may have paid above price!

                /* this is too slow to block the ui so it is commented out - the server checks the deposit before displaying message in receiver's inboc
                const receipt: TransactionReceipt = await resp.wait(1)
                console.log("receipt: " + receipt.transactionHash)
                setTransactionStatus(EthTransactionStatus.confirmed)

                // check deposit
                const deposit = await contract.getDeposit(depositId)
                console.log("Depositor: " + deposit.depositor)
                console.log("Recipient: " + deposit.recipient)
                console.log("Amount: " + deposit.amount.toString())
                 */

            } catch (err : any) {
                if (err.code === 4001) {
                    console.log("User rejected the transaction in metamask")
                    setTransactionStatus(EthTransactionStatus.userRejected)
                } else {
                    setTransactionStatus(EthTransactionStatus.error)
                }
                console.log("tx error: " + err)
            }
        } catch (error) {
            console.log("error making payment: ", error)
            setTransactionStatus(EthTransactionStatus.error)
        }
    }

    async function onSendNewMessageClicked() {
        console.log("send new message clicked...")
        if (!enableSendButton) {
            console.log("user shouldn't have been able to click on send")
            return // jic
        }

        if (props.localAccount === null) {
            return // jic
        }

        const state = getRootState()

        const key_pair_data = state.account.key_pair
        if (key_pair_data === null) {
            console.log("missing user key pair")
            return
        }

        const key_pair = Keypair.deserializeBinary(base64.decode(key_pair_data))

        // Check that deposit transaction price is at least receiver asking price for open or reply
        switch (transactionAction) {
            case PaidActionType.PAID_ACTION_TYPE_OPEN:
                const openPayment = BigInt(getToUserOpenPrice())
                if (transactionValue.lt(openPayment)) {
                    console.error("Transaction amount below receiver open price. Ask: " + openPayment.toString() + " wei, deposit: " + transactionValue.toString() + " wei")
                    return
                }
                break;
            case PaidActionType.PAID_ACTION_TYPE_REPLY:
                const replyPayment = BigInt(getToUserReplyPrice())
                if (transactionValue.lt(replyPayment)) {
                    console.error("Transaction amount below receiver reply price. Ask: " + replyPayment.toString() + " wei, deposit: " + transactionValue.toString() + " wei")
                    return
                }
                break;
        }

        const amount = new Amount()
        amount.setAmount(transactionValue.toString())
        amount.setToken(Token.TOKEN_ETH)
        const payment = new Payment()
        payment.setAmount(amount)
        payment.setPaidActionType(transactionAction)
        console.log("payment action type: " + transactionAction)
        payment.setTransactionId(CryptoUtils.hexToU8NoPrefix(transactionHash.substring(2)))
        console.log("payment transaction id: " + transactionHash)

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

        const messageId = new MessageId()
        // thread first message is has id 0x0
        messageId.setMessageThreadId(new Uint8Array(8))
        messageId.setThreadId(threadId)

        const params : SendNewThreadParams = {
            sender: props.localAccount!,
            sender_key_pair: key_pair, // sender account key pair
            content: content, // unencrypted yet
            receiver: toAccount!,
            message_id: messageId,
            payment: payment, // payment info (tx, amount, payment type...)
        }

        console.log("created NewThread call data - calling sendNewThread()....")

        setSendInProgress(true)
        dispatch(newThread(params))
    }

    // todo: show last error - in case send failed. setSendInProgress(false)

    // Rendering
    //

    if (props.localAccount === null || getNewThreadCreated()) {
        // if no user or thread was created by user then redirect to user's default page (e.g. inbox)
        return <Redirect to='/'/>
    }

    return (
    <Grid style={{marginTop:'10px', paddingBottom:'36px'}}>
        <GridColumn width={11}>
            <Container style={{ paddingTop: '0px', opacity: '85%', paddingLeft:'20px', textAlign:'left' }}>
                <Message attached>
                    <Message.Header>Compose a new message</Message.Header>
                </Message>
                <Segment attached>
                    <Form error>
                        <Popup content="Enter the message's receiver cmail user name. e.g. @admin or subnetter1" trigger={
                            <div style={{marginBottom:'20px'}}>
                                <Label color='yellow' ribbon>To</Label>
                                    <FormInput required={true}
	                                       error={displayAccountError}
	                                       width={6}
	                                       placeholder='Enter message receiver cmail user name'
	                                       id='form-input-to-name'
	                                       autoFocus
	                                       icon={toFieldIconName}
	                                       onBlur={() => onToNameFocusOut()}
	                                       onFocus={() => onToNameFocusIn()}
	                                       value={toName}
	                                       onChange={(e) => setToName(e.target.value)}
	                                       key='to-name'/>
                            </div>

                        } />
                        <Popup content="Enter the message's topic and call to action" trigger={
                            <span>
                            <Label color='yellow' ribbon>Subject</Label>
                            <FormInput required={true}
                                       error={subjectError}
                                       width={16}
                                       placeholder='Enter what your message is about'
                                       id='form-input-to-subject'
                                       onBlur={() => onSubjectFocusOut()}
                                       onFocus={() => onSubjectFocusIn()}
                                       value={subject}
                                       onChange={(e) => setSubject(e.target.value)}
                                       key='subject'/></span>
                        } />
                        {getErrorMessage()}
                    </Form>
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
                { toAccount !== null && paymentTransactionSubmittedOrConfirmed &&
                    <Segment attached>
                        <h4>Payment</h4>
                        {transactionStatus === EthTransactionStatus.submitted &&
                            <Message info>
                                <MessageHeader>
                                    Transaction Submitted
                                </MessageHeader>
                                <MessageContent style={{marginTop: '10px'}}>
                                    <a target='_blank' rel='noreferrer' href={etherScanTransactionUrl(transactionHash)}>Transaction Details</a>
                                </MessageContent>
                            </Message>
                        }
                        {transactionStatus === EthTransactionStatus.confirmed &&
                        <Message success>
                            <MessageHeader>
                                Payment Confirmed
                            </MessageHeader>
                            <MessageContent style={{marginTop: '10px'}}>
                                <a target='_blank' rel='noreferrer' href={etherScanTransactionUrl(transactionHash)}>Transaction Details</a>
                            </MessageContent>
                        </Message>
                        }
                    </Segment>
                }
                { toAccount !== null && !paymentTransactionSubmittedOrConfirmed &&
                    <Segment attached>
                        <h4>Payment</h4>
                        <div style={{marginBottom: '10px'}}>{getPaymentSummaryText()}</div>
                        <Popup header='Pay Open Price' content={getPayToOpenPopupText()} trigger={
                            <Button as='div' labelPosition='right'>
                                <Button color='green'
                                        onClick={(_) => onMakePaymentClicked(PaidActionType.PAID_ACTION_TYPE_OPEN)}>
                                    Pay Open Price
                                </Button>
                                <Label basic color='green' pointing='left'>
                                    <Icon name="ethereum" style={{marginRight:'2px'}}/>
                                    {utils.formatEther(getToUserOpenPrice())}
                                    {" "}ETH
                                </Label>
                            </Button>
                        }/>
                        { getToUserReplyPrice() !== "0" &&
                            <Popup header='Pay Reply Price' content={getPayToReplyPopupText()} trigger={
                                <Button style={{marginLeft: '20px'}} as='div' labelPosition='right'>
                                    <Button color='orange'
                                            onClick={(_) => onMakePaymentClicked(PaidActionType.PAID_ACTION_TYPE_REPLY)}>
                                        Pay Reply Price
                                    </Button>
                                    <Label basic color='orange' pointing='left'>
                                        <Icon name="ethereum" style={{marginRight:'2px'}}/>
                                        {utils.formatEther(getToUserReplyPrice())}
                                        {" "}ETH
                                    </Label>
                                </Button>
                            }/>
                        }
                        { !metaMaskAvailable &&
                            <Message info>
                                <MessageHeader>
                                    🦊&nbsp;&nbsp; Metamask is not available
                                </MessageHeader>
                                <MessageContent style={{marginTop: '10px'}}>
                                    To make a payment please enable it and unlock it for this website.
                                </MessageContent>
                            </Message>
                        }
                        { metaMaskAvailable && metaMaskLocked &&
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
                        { metaMaskAvailable && !metaMaskLocked && !isUserEthAccountMetamaskUnlocked &&
                            <Message error>
                                <MessageHeader>
                                    🦊&nbsp;&nbsp; Wrong Ethereum Account
                                </MessageHeader>
                                <MessageContent style={{marginTop: '10px'}}>
                                    Please select your cmail Ethereum account {userEthAddressStr} in Metamask.
                                </MessageContent>
                            </Message>
                        }
                        { metaMaskAvailable && !metaMaskLocked && isUserEthAccountMetamaskUnlocked &&
                            <div style={{marginTop: '10px'}}>🦊&nbsp;&nbsp; Metamask unlocked and connected.</div>
                        }

                        { transactionStatus === EthTransactionStatus.userRejected &&
                            <Message error>
                                <MessageHeader>
                                   Transaction Rejected
                                </MessageHeader>
                                <MessageContent style={{marginTop: '10px'}}>
                                    You rejected the payment transaction in metamask. Please try again.
                                </MessageContent>
                            </Message>
                        }
                        { transactionStatus === EthTransactionStatus.error &&
                            <Message error>
                                <MessageHeader>
                                    Transaction Error
                                </MessageHeader>
                                <MessageContent style={{marginTop: '10px'}}>
                                    Payment transaction error. Please check the transaction in Metamask.
                                </MessageContent>
                            </Message>
                        }
                    </Segment>
                }
                <Segment attached>
                    <Grid columns="equal">
                        <Grid.Column stretched width={12}>
                            { showNewThreadSendErrorMessage() &&
                                <Message error>
                                    <MessageHeader>
                                        😞&nbsp;&nbsp; Failed to send message
                                    </MessageHeader>
                                    <MessageContent style={{marginTop: '10px'}}>
                                        {getNewThreadSendErrorMessage()}
                                    </MessageContent>
                                </Message>
                            }
                            <div>Not sure what to do? <a href='/support'>Help & Support</a></div>
                        </Grid.Column>
                        <Grid.Column textAlign='right'>
                            <Popup header='Send this message' content='Get 100 cmail tokens for this action.' trigger={
                                <Button
                                    color='blue'
                                    onClick={onSendNewMessageClicked}
                                    disabled={!enableSendButton}>
                                    <Icon name='send'/>
                                    Send
                                    <Label style={{top:'-20px', position:'relative', left:'30px', color: 'white'}}
                                           size='tiny' color='red' floating>+100</Label>
                                </Button>
                            }/>
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Container>
        </GridColumn>
        {toAccount !== null &&
            <GridColumn width={5} style={{opacity: '85%', paddingRight:'30px'}}>
               <UserCard user={toAccount!} clickable={false}/>
            </GridColumn>
        }
    </Grid>)
}

export default NewThreadComposer
