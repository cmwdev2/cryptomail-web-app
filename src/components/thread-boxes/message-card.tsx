// @ts-ignore
import React, {useEffect, useState} from 'react'
import {
    Card,
    Label,
    Icon, CardContent, Button, Popup, Message, MessageHeader, MessageContent

} from 'semantic-ui-react'
import {max_preview_chars} from '../../common/config'
import MarkdownPreview from '@uiw/react-markdown-preview'
import {Keypair, PaidActionType} from '../../proto/types/types_pb'
import {ethers, utils} from "ethers"
import {useAppDispatch, useAppSelector} from '../../app/hooks'
import {base64} from "ethers/lib/utils"
import {etherScanTransactionUrl, format_eth_address, timeAgo} from '../../common/time'
import getNetConfig, {EthTransactionStatus} from "../../features/ethereum/config"
import {getRootState} from "../../app/store"
import detectEthereumProvider from "@metamask/detect-provider"
import cmailAbiJson from "../../features/ethereum/crypto_mail_abi.json"
import {TransactionReceipt, TransactionResponse} from "@ethersproject/abstract-provider"
import {openMessage, OpenMessageParams} from '../../features/messaging/open-message'
import {getUniqueMessageId} from '../../common/message-id'
import {MessageData} from '../../common/types'
import DOMPurify from 'dompurify'
import {Account} from '../../proto/types/accounts_pb'

interface MessageCardProps {
    message: MessageData
    interactiveMetamaskConnect: () => void
    replyToMessageAction: (data: MessageData) => void
    showCommands: boolean,
    localAccount: Account
}

// Message card displays a message
function MessageCard(props: MessageCardProps) {
    const dispatch = useAppDispatch()

    const [subject, setSubject] = useState("")
    const [senderName, setSenderName] = useState("")
    const [receiverName, setReceiverName] = useState("")
    const [sentTime, setSentTime] = useState("")

    const [body, setBody] = useState("")
    const [openAmount, setOpenAmount] = useState ( BigInt(0))
    const [replyAmount, setReplyAmount] = useState (BigInt(0))
    const [outgoingMessage, setOutgoingMessage] = useState(false)

    const hasOpenPayment = openAmount.toString() !== "0"
    const hasReplyPayment = replyAmount.toString() !== "0"
    const hasPayment = hasOpenPayment || hasReplyPayment

    const [receiverReplied, setReceiverReplied] = useState(false)
    const [receiverOpened, setReceiverOpened] = useState(false)

    const metaMaskAvailable = (typeof window.ethereum !== 'undefined')
    const metaMaskLocked = useAppSelector((state) => state.ethereum.account === null)
    const [transactionStatus, setTransactionStatus] = useState(EthTransactionStatus.unspecified)
    const withdrawTransactionSubmittedOrConfirmed = transactionStatus === EthTransactionStatus.submitted || transactionStatus === EthTransactionStatus.confirmed
    const [transactionHash, setTransactionHash] = useState("")

    const [depositOnChain, setDepositOnChain] = useState(true)

    // eslint-disable-next-line
    const localUserMadeDeposit = outgoingMessage && depositOnChain

    // eslint-disable-next-line
    const [depositWithdrawn, setDepositWithdrawn] = useState(false)
    const [depositRefundable, setDepositRefundable] = useState(false)

    const [userEthAddress, setUserEthAddress] = useState("")
    const paymentWithdrawn = hasPayment && (withdrawTransactionSubmittedOrConfirmed || !depositOnChain)

    console.log("Deposit on chain: " + depositOnChain)
    console.log("Payment withdrawn: " + paymentWithdrawn)
    console.log("Server returned opened: " + props.message.message.getOpened())
    console.log("Server returned reply: " + props.message.message.getReplied())

    const isUserEthAccountMetamaskUnlocked = useAppSelector((state) => {
        if (state.ethereum.account === null || state.ethereum.account === "0" ) {
            return false
        }
        if (!ethers.utils.isAddress(state.ethereum.account)) {
            return false
        }
        const metamaskAddress = ethers.utils.getAddress(state.ethereum.account)
        if (userEthAddress === "") {
            return false
        }
        const userAddress = ethers.utils.getAddress(userEthAddress)
        return userAddress === metamaskAddress
    })

    useEffect(() => {
        console.log("message card main effect")

        const state = getRootState()

        const payment_settings = props.localAccount.getPublicAccountInfo()!.getPaymentSettings()

        let user_eth_address = ""
        if (payment_settings) {
            user_eth_address = format_eth_address(payment_settings.getEthAddress()!.getBytes_asU8())
        }
        setUserEthAddress(DOMPurify.sanitize(user_eth_address))

        const message_data = props.message
        setSubject(DOMPurify.sanitize(new TextDecoder().decode(message_data.content.getSubject()!.getData_asU8()).substring(0,max_preview_chars)))
        setBody(DOMPurify.sanitize(new TextDecoder().decode(message_data.content.getBody()!.getData_asU8())))
        setSenderName(DOMPurify.sanitize(message_data.sender.getPublicAccountInfo()!.getName()))
        setReceiverName(DOMPurify.sanitize(message_data.receiver.getPublicAccountInfo()!.getName()))

        setReceiverOpened(props.message.message.getOpened())
        setReceiverReplied(props.message.message.getReplied())

        const timeStamp = Math.round(message_data.user_data.getCreated() / 1000000)
        const timeAgoStr: string = timeAgo(timeStamp)
        let utcDate = new Date(0)
        utcDate.setUTCMilliseconds(timeStamp)
        const localDateStr = utcDate.toLocaleDateString() + " · " + utcDate.toLocaleTimeString()
        setSentTime(localDateStr + " · " + timeAgoStr)

        const isOutgoing = props.localAccount.getIdPubKey()!.getKey_asU8().toString() === message_data.sender.getIdPubKey()!.getKey_asU8().toString()

        if (isOutgoing) {
            console.log("message is a message sent from local user... ")
        }

        setOutgoingMessage(isOutgoing)

        if (!isOutgoing && !props.message.message.getOpened()) {
            console.log("calling OpenMessage...")
            onMessageOpened()
        }

        const payment = message_data.user_data.getPayment()
        if (!payment) {
            console.log("unpaid message")
            return
        } else {
            console.log("paid to open or to reply message")
        }

        const deposit_data = message_data.message.getDepositData()
        if (!deposit_data) {
            console.warn("no deposit data")
            return
        }

        const deposit_confirmation = deposit_data!.getDepositConfirmation()
        if (!deposit_confirmation) {
            console.warn("no deposit confirmation yet by server")
        }

        const amountData = payment!.getAmount()
        if (!amountData) {
            console.log("no payment amount specified")
            return
        }

        // expected payment amount
        const expected_amount = BigInt(amountData!.getAmount())
        console.log("message payment amount (wei): " + expected_amount)

        console.log("payment action type: " + payment!.getPaidActionType())
        if (payment!.getPaidActionType() === PaidActionType.PAID_ACTION_TYPE_OPEN ) {
            setOpenAmount(expected_amount)
        } else if (payment!.getPaidActionType() === PaidActionType.PAID_ACTION_TYPE_REPLY ) {
            setReplyAmount(expected_amount)
        } else {
            console.warn("unsupported paid action type")
            return
        }

        function onMessageOpened() {
            console.log("☁️ calling OpenMessage()...")
            const key_pair_data = state.account.key_pair
            if (key_pair_data === null) {
                console.error("can't find key pair in state")
                return
            }

            const open_message_params : OpenMessageParams = {
                message_id: props.message.user_data.getMessageId()!,
                sender: props.localAccount,
                sender_key_pair: Keypair.deserializeBinary(base64.decode(key_pair_data)),
            }
            dispatch(openMessage(open_message_params))
        }

        async function verifyDeposit(expected_amount: BigInt) {
            const provider = new ethers.providers.Web3Provider(window.ethereum as any)
            const chainId = state.ethereum.chainId
            const net_config = getNetConfig(chainId)

            console.log("cmail contract address: " + net_config.contractAddress)
            console.log("chain id: " + chainId)

            const messageId = props.message.user_data.getMessageId()!
            const contract = new ethers.Contract(net_config.contractAddress, cmailAbiJson, provider)
            const deposit = await contract.getDeposit(getUniqueMessageId(messageId))

            setDepositWithdrawn(false)
            setDepositRefundable(false)

            if (!deposit) {
                console.error("failed to get deposit on-chain data")
                setDepositOnChain(false)
                return
            }

            const amount = deposit.amount

            if (amount.toString() === "0") {
                console.warn("deposit was already withdrawn")
                setDepositWithdrawn(true)
                setDepositOnChain(false)
                return
            }

            console.log("deposit amount from chain: " + utils.formatEther(amount.toString()) + " eth")

            if (amount.lt(expected_amount)) {
                console.warn("deposit is less than expected amount")
            }

            if (deposit.recipient !== user_eth_address) {
                console.info("deposit is not for local user eth address")
                console.log("local user eth address: " + user_eth_address)
                console.log("recipient address: " + deposit.recipient)
            }

            if (isOutgoing) {
                // check if outgoing message and deposit is refundable
                const period : number = await contract.getTimeout()
                const currentBlock: number = await provider.getBlockNumber()
                if (currentBlock - deposit.block >= period) {
                    console.log("deposit is refundable")
                    // refundable
                    setDepositRefundable(true)
                }

            }
            setDepositOnChain(true)
        }

        verifyDeposit(expected_amount).then()

    }, [props.message, dispatch, props.localAccount])

    async function onReplyClicked() {
        console.log("reply to message...")
        props.replyToMessageAction(props.message)
    }

    async function onWithdrawPaymentClicked() {
        try {
            const state = getRootState()

            if (typeof window.ethereum === 'undefined') {
                console.log("Metamask provider not available")
                return
            }

            // reset transaction state
            setTransactionStatus(EthTransactionStatus.unspecified)
            setTransactionHash("")

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
            const net_config = getNetConfig(chainId)

            console.log("cmail contract address: " + net_config.contractAddress)
            console.log("chain id: " + chainId)
            const withdrawId = getUniqueMessageId(props.message.user_data.getMessageId()!)
            const contract = new ethers.Contract(net_config.contractAddress, cmailAbiJson, signer)

            const deposit = await contract.getDeposit(withdrawId)
            console.log(deposit)

            try {
                let resp : TransactionResponse = await contract.withdraw(withdrawId)
                console.log("submitted tx hash: " + resp.hash)
                setTransactionStatus(EthTransactionStatus.submitted)
                setTransactionHash(resp.hash)

                const receipt: TransactionReceipt = await resp.wait(1)
                console.log("receipt tx hash : " + receipt.transactionHash)
                setTransactionStatus(EthTransactionStatus.confirmed)

            } catch (err : any) {
                if (err.code === 4001) {
                    console.log("User rejected the transaction in metamask")
                    setTransactionStatus(EthTransactionStatus.userRejected)
                } else if (err.code === -32603) {
                    console.log("vm exception - already withdrawn")
                }
                setTransactionStatus(EthTransactionStatus.error)

                console.log("tx error: " + err)
            }
        } catch (error) {
            console.log("error making payment: ", error)
            setTransactionStatus(EthTransactionStatus.error)
        }
    }

    async function onRefundPaymentClicked() {
        try {
            const state = getRootState()

            if (!depositRefundable || !outgoingMessage || !depositOnChain) {
                console.log("can't refund")
                return
            }

            if (typeof window.ethereum === 'undefined') {
                console.log("Metamask provider not available")
                return
            }

            // reset transaction state
            setTransactionStatus(EthTransactionStatus.unspecified)
            setTransactionHash("")

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
            const net_config = getNetConfig(chainId)

            console.log("cmail contract address: " + net_config.contractAddress)
            console.log("chain id: " + chainId)
            const withdrawId = getUniqueMessageId(props.message.user_data.getMessageId()!)
            const contract = new ethers.Contract(net_config.contractAddress, cmailAbiJson, signer)
            const deposit = await contract.getDeposit(withdrawId)
            console.log(deposit)

            try {
                let resp : TransactionResponse = await contract.refund(withdrawId)
                console.log("submitted refund tx hash: " + resp.hash)
                setTransactionStatus(EthTransactionStatus.submitted)
                setTransactionHash(resp.hash)

                console.log("waiting for tx confirmation..")
                const receipt: TransactionReceipt = await resp.wait(1)
                console.log("receipt tx hash : " + receipt.transactionHash)
                setTransactionStatus(EthTransactionStatus.confirmed)
                setDepositRefundable(false)

            } catch (err : any) {
                if (err.code === 4001) {
                    console.log("User rejected the transaction in metamask")
                    setTransactionStatus(EthTransactionStatus.userRejected)
                } else if (err.code === -32603) {
                    console.log("vm exception - already withdrawn")
                }
                setTransactionStatus(EthTransactionStatus.error)

                console.log("tx error: " + err)
            }
        } catch (error) {
            console.log("error making payment: ", error)
            setTransactionStatus(EthTransactionStatus.error)
        }
    }

    function getReplyPopupText() {
        if (hasReplyPayment && !paymentWithdrawn) {
            return 'Reply to this message to collect the reply payment of ' + ethers.utils.formatEther(replyAmount) + " eth."
        }

        return 'Compose a reply to this message'
    }

    // should show last message from other party in this thread
    return (<Card fluid={true} raised={true}>
            <CardContent>
                <span style={{fontSize:"larger"}}>{subject}</span>
            </CardContent>
            <CardContent>
                <span style={{fontSize:'small'}}>From <b>{senderName}</b> · To <b>{receiverName}</b> · {sentTime}</span>
            </CardContent>
            <CardContent style={{background:'#eeeeee'}}>
                <div style={{width:'100%', height:'100%', marginTop:'10px', marginBottom:'10px', overflow:'auto', fontSize:"larger"}}>
                    <MarkdownPreview source={body} />
                </div>
            </CardContent>
            <CardContent extra>
                {!hasPayment && <p style={{color:'#5555550'}}>This is an unpaid message.</p> }

                {!outgoingMessage && receiverOpened && <p style={{color: '#5555550'}}><Icon color='green' name='check circle outline'/>You opened this message.</p>}
                {!outgoingMessage && receiverReplied && <p style={{color: '#5555550'}}><Icon color='green' name='check circle outline'/>You replied to this message.</p>}
                {!outgoingMessage && paymentWithdrawn && hasOpenPayment && <p style={{color: '#5555550'}}><Icon color='green' name='check circle outline'/>You have withdrawn the {ethers.utils.formatEther(openAmount)} ETH payment for opening this message.</p>}
                {!outgoingMessage && paymentWithdrawn && hasReplyPayment && <p style={{color: '#5555550'}}><Icon color='green' name='check circle outline'/>You have withdrawn the {ethers.utils.formatEther(replyAmount)} ETH payment for replying to this message.</p>}

                {outgoingMessage && receiverOpened && hasOpenPayment && <p style={{color: '#5555550'}}><Icon color='green' name='check circle outline'/>Message was opened by receiver.</p>}
                {outgoingMessage && !receiverOpened && hasOpenPayment && <p style={{color: '#5555550'}}>Message was not opened by receiver yet.</p>}
                {outgoingMessage && !receiverReplied && hasReplyPayment && <p style={{color: '#5555550'}}>Message was not replied by receiver yet.</p>}
                {outgoingMessage && hasReplyPayment && receiverReplied && <p style={{color: '#5555550'}}><Icon color='green' name='check circle outline'/>Message was replied by receiver.</p>}

                {outgoingMessage && paymentWithdrawn && hasOpenPayment && <p style={{color: '#5555550'}}><Icon color='green' name='check circle outline'/>Receiver withdrew the {ethers.utils.formatEther(openAmount)} ETH open message payment (or sender got a refund).</p>}
                {outgoingMessage && paymentWithdrawn && hasReplyPayment && <p style={{color: '#5555550'}}><Icon color='green' name='check circle outline'/>Receiver withdrew the {ethers.utils.formatEther(replyAmount)} ETH replay message payment (or sender got a refund).</p>}

                {outgoingMessage && !paymentWithdrawn && hasPayment && hasOpenPayment && <p style={{color: '#5555550'}}>Receiver didn't withdraw your {ethers.utils.formatEther(openAmount)} ETH open message payment yet.</p>}
                {outgoingMessage && !paymentWithdrawn && hasPayment && hasReplyPayment && <p style={{color: '#5555550'}}>Receiver didn't withdraw your {ethers.utils.formatEther(replyAmount)} ETH reply message payment yet.</p>}
                {outgoingMessage && !paymentWithdrawn && hasPayment && depositRefundable && <p style={{color: '#5555550'}}><Icon color='green' name='check circle outline'/>The payment you made is refundable.</p>}
            </CardContent>

            { outgoingMessage && !paymentWithdrawn && hasPayment && depositRefundable && <CardContent extra>
                {openAmount.toString() !== "0" && <Popup header='Get a refund'
                        content="You can get a refund for your deposit as the receiver didn't withdraw it for a long time. Execute a smart contract transaction using Metamask to refund your account with the payment you made for this message."
                        trigger={
                        <Button as='div' labelPosition='right' onClick={(_) =>
                        onRefundPaymentClicked()}>
                        <Button color='blue'>Refund</Button>
                        <Label basic color='blue' pointing='left'>
                        <Icon name="ethereum"/>
                    {utils.formatEther(openAmount)} ETH
                        </Label>
                        </Button>
                    }/>
                }
                {replyAmount.toString() !== "0" && <Popup header='Get a refund'
                   content="You can get a refund for your deposit as the receiver didn't withdraw it for a long time. Execute a smart contract transaction using Metamask to refund your account the payment you made for this message."
                    trigger={
                         <Button as='div' labelPosition='right' onClick={(_) =>
                             onRefundPaymentClicked()}>
                             <Button color='blue'>Refund</Button>
                             <Label basic color='blue' pointing='left'>
                                 <Icon name="ethereum"/>
                                 {utils.formatEther(replyAmount)} ETH
                             </Label>
                         </Button>
                     }/>
                }
                </CardContent>
            }

            {!outgoingMessage && props.showCommands && <CardContent extra>
                {!paymentWithdrawn && openAmount.toString() !== "0" &&
			    <Popup header='Collect Payment'
			           content='Execute a smart contract transaction using Metamask to receive the payment for reading this message.'
			           trigger={
                           <Button as='div' labelPosition='right' onClick={(_) =>
                               onWithdrawPaymentClicked()}>
                               <Button color='blue'>
                                   Collect Payment
                               </Button>
                               <Label basic color='blue' pointing='left'>
                                   <Icon name="ethereum"/>
                                   {utils.formatEther(openAmount)} ETH
                               </Label>
                           </Button>
                       }/>
                }

                {!paymentWithdrawn && receiverReplied  && replyAmount.toString() !== "0" &&
			    <Popup header='Paid Reply' content='Execute a smart contract transaction to get the reply payment'
			           trigger={
                           <Button as='div' onClick={(_) => onWithdrawPaymentClicked()} labelPosition='right'>
                               <Button color='orange'>
                                   Get Reply Payment
                               </Button>
                               <Label basic color='orange' pointing='left'>
                                   <Icon name="ethereum"/>
                                   {utils.formatEther(replyAmount)}
                               </Label>
                           </Button>
                       }/>
                }

                {!paymentWithdrawn && hasPayment && !metaMaskAvailable &&
			    <Message info>
				    <MessageHeader>
					    🦊&nbsp;&nbsp; Metamask is not available
				    </MessageHeader>
				    <MessageContent style={{marginTop: '10px'}}>
					    To make get your payment please enable it and unlock it for this website.
				    </MessageContent>
			    </Message>
                }

                {!paymentWithdrawn && hasPayment && metaMaskAvailable && metaMaskLocked &&
			    <Message>
				    <MessageHeader>
					    🦊&nbsp;&nbsp; Metamask locked
				    </MessageHeader>
				    <MessageContent style={{marginTop: '10px'}}>
					    To get your payment please unlock it for this website.
					    <div style={{marginTop: '10px'}}>
						    <Button basic color='blue' as='a' onClick={() => props.interactiveMetamaskConnect()}>Unlock Metamask</Button>
					    </div>
				    </MessageContent>
			    </Message>
                }
                {!paymentWithdrawn && hasPayment && metaMaskAvailable && !metaMaskLocked && !isUserEthAccountMetamaskUnlocked &&
			    <Message error>
				    <MessageHeader>
					    🦊&nbsp;&nbsp; Wrong Ethereum Account Selected
				    </MessageHeader>
				    <MessageContent style={{marginTop: '10px'}}>
					    Please select your cmail Ethereum account {userEthAddress} in Metamask.
				    </MessageContent>
			    </Message>
                }

                {!paymentWithdrawn && hasPayment && metaMaskAvailable && !metaMaskLocked && isUserEthAccountMetamaskUnlocked &&
			        <div style={{marginTop: '10px'}}>🦊&nbsp;&nbsp; Metamask unlocked and connected.</div>
                }

                {!paymentWithdrawn && hasPayment && transactionStatus === EthTransactionStatus.userRejected &&
			    <Message error>
				    <MessageHeader>
					    Transaction Rejected
				    </MessageHeader>
				    <MessageContent style={{marginTop: '10px'}}>
					    You rejected the payment transaction in metamask. Please try again.
				    </MessageContent>
			    </Message>
                }

                {!paymentWithdrawn && hasPayment && transactionStatus === EthTransactionStatus.error &&
			    <Message error>
				    <MessageHeader>
					    Transaction Error
				    </MessageHeader>
				    <MessageContent style={{marginTop: '10px'}}>
					    Payment transaction error. Please check the transaction in Metamask.
				    </MessageContent>
			    </Message>
                }

                {transactionHash !== "" && transactionStatus === EthTransactionStatus.submitted &&
			    <Message info>
				    <MessageHeader>
					    Withdraw Transaction Submitted
				    </MessageHeader>
				    <MessageContent style={{marginTop: '10px'}}>
					    <a target='_blank' rel='noreferrer' href={etherScanTransactionUrl(transactionHash)}>Transaction Details</a>
				    </MessageContent>
			    </Message>
                }

                {transactionHash !== "" && transactionStatus === EthTransactionStatus.confirmed &&
			    <Message success>
				    <MessageHeader>
					    Withdraw Confirmed
				    </MessageHeader>
				    <MessageContent style={{marginTop: '10px'}}>
					    <a target='_blank' rel='noreferrer' href={etherScanTransactionUrl(transactionHash)}>Transaction Details</a>
				    </MessageContent>
			    </Message>
                }

            </CardContent>}

        {!outgoingMessage && props.showCommands &&
            <CardContent extra> <Popup content={getReplyPopupText()}
               trigger={
                   <Button basic color='blue' onClick={(_) => onReplyClicked()}>
                       <Icon name="reply"/>
                       Reply
                   </Button>
               }/>
           </CardContent>
        }
        </Card>
    )
}

export default MessageCard
