// @ts-ignore
import React, {useState} from 'react'
import {
    Header,
    Icon,
    Label,
    Popup,
    Segment,
    SegmentGroup,
    TabPane,
    Button,
    Accordion,
    FormField,
    Input,
    ItemGroup,
    Message,
    MessageHeader, MessageContent
} from 'semantic-ui-react'
import {useEffect} from 'react'
import {OptionalAccount} from '../../common/types'
import {Amount, EthAddress, PaidActionType, Token} from '../../proto/types/types_pb'
import {format_eth_address} from '../../common/time'
import {ethers, utils} from 'ethers'
import {useAppDispatch, useAppSelector} from '../../app/hooks'
import {signMessage} from '../../features/ethereum/ethereum-thunks'
import {updateSignature} from '../../features/ethereum/ethereum-slice'
import {getRootState} from '../../app/store'
import * as aesjs from 'aes-js'
import {updateSettings} from '../../features/account/update-settings'
import {Account} from '../../proto/types/accounts_pb'
import {base64} from 'ethers/lib/utils'
import {formatWeiAmount} from '../../features/ethereum/utils'

interface PaymentSettingsProps {
    localAccount: OptionalAccount
    interactiveMetamaskConnect: () => void
}

function PaymentSettings(props: PaymentSettingsProps) {

    const dispatch = useAppDispatch()

    // const dispatch = useAppDispatch()
    const [localAccountName, setLocalAccountName] = useState("")
    const [ethAddress, setEthAddress] = useState("0x0")
    const [openPrice, setOpenPrice] = useState("0")
    const [replyPrice, setReplyPrice] = useState("0")

    // in ether units
    const [openPriceInput, setOpenPriceInput] = useState("0")
    const [replyPriceInput, setReplyPriceInput] = useState("0")

    // eth account state
    const ethAccount = useAppSelector((state) => state.ethereum.account)
    const ethSignature = useAppSelector((state) => state.ethereum.signature)
    const displayMetamaskConnect = useAppSelector((state) => state.ethereum.account === null)
    const metaMaskAvailable = (typeof window.ethereum !== 'undefined')

    useEffect(() => {
        if (props.localAccount === null) {
            return
        }

        // clear eth signature state
        dispatch(updateSignature(null))

        const account_info = props.localAccount.getPublicAccountInfo()!
        setLocalAccountName(account_info.getName())

        const payment_settings = account_info.getPaymentSettings()

        if (payment_settings) {
            const address = format_eth_address(payment_settings.getEthAddress()!.getBytes_asU8())
            setEthAddress(address)

            const prices = payment_settings!.getPaidActionsList()
            for (const price of prices) {
                if (price.getPaidActionType()! === PaidActionType.PAID_ACTION_TYPE_OPEN) {
                    // console.log("To user open price: " + price.getPrice()!.getAmount())
                    const amount = price.getPrice()!.getAmount()
                    setOpenPrice(amount)
                    setOpenPriceInput(utils.formatEther(amount))
                }
                if (price.getPaidActionType()! === PaidActionType.PAID_ACTION_TYPE_REPLY) {
                    // console.log("To user open price: " + price.getPrice()!.getAmount())
                    const amount = price.getPrice()!.getAmount()
                    setReplyPrice(amount)
                    setReplyPriceInput(utils.formatEther(amount))
                }
            }
        }

    }, [props.localAccount, dispatch])

    const etherScanAddress = 'https://etherscan.io/address/' + ethAddress

    function getPayToOpenPopupText() {
        return 'todo: write me'
    }

    function getPayToReplyPopupText() {
        return 'todo: write me'
    }

    function isOpenPriceInputInvalid() : boolean {
        const n = parseFloat(openPriceInput)
        if (isNaN(n)) {
            return true
        }
        return false
    }

    function isReplyPriceInputInvalid() : boolean {
        const n = parseFloat(replyPriceInput)
        if (isNaN(n)) {
            return true
        }
        return false
    }

    function displaySaveButton() : boolean {
        if (isOpenPriceInputInvalid() || isReplyPriceInputInvalid()) {
            return true
        }

        if (ethSignature && ethAddress !== ethAccount) {
            return true
        }

        const openPriceChanged = openPrice !== ethers.utils.parseEther(openPriceInput).toString()
        const replyPriceChanged = replyPrice !== ethers.utils.parseEther(replyPriceInput).toString()
        return openPriceChanged || replyPriceChanged
    }

    function saveButtonEnabled() : boolean {
        return !isReplyPriceInputInvalid() && !isOpenPriceInputInvalid()
    }

    function onSaveButtonClicked() {
        console.log("save payment settings update...")
        if (isReplyPriceInputInvalid() || isOpenPriceInputInvalid()) {
            return
        }

        const state = getRootState()

        const account: Account = Account.deserializeBinary(base64.decode(state.account.account))
        const account_info = account.getPublicAccountInfo()!
        const payment_settings = account_info.getPaymentSettings()!

        const prices = payment_settings.getPaidActionsList()
        for (const price of prices) {
            if (price.getPaidActionType()! === PaidActionType.PAID_ACTION_TYPE_OPEN) {
                const priceOpen = ethers.utils.parseEther(openPriceInput)
                const amount = new Amount()
                amount.setAmount(priceOpen.toString())
                amount.setToken(Token.TOKEN_ETH)
                price.setPrice(amount)
            }
            if (price.getPaidActionType()! === PaidActionType.PAID_ACTION_TYPE_REPLY) {
                const priceReply = ethers.utils.parseEther(replyPriceInput)
                const amount = new Amount()
                amount.setAmount(priceReply.toString())
                amount.setToken(Token.TOKEN_ETH)
                price.setPrice(amount)
            }
        }

        if (ethSignature) {
            const address = new EthAddress()
            address.setBytes(Uint8Array.from(aesjs.utils.hex.toBytes(ethAccount.substring(2))))
            payment_settings.setEthAddress(address)

            console.log("sign up eth signature: " + ethSignature)
            payment_settings.setEthSignature(Uint8Array.from(aesjs.utils.hex.toBytes(ethSignature.substring(2))))
        }
        dispatch(updateSettings({
            account_info: account_info,
            settings: account.getSettings()!}))
    }

    function signEthAddressClickHandler() {
        dispatch(signMessage({ethAccount: ethAccount, message: localAccountName}))
    }

    const changeEthAddressEditor = [
        {
            key: 'details',
            title: 'Change',
            content: {
                content: (
                    <ItemGroup>
                        {ethAccount !== null && ethAccount !== '' &&
	                    <div style={{display:'flex', alignItems:'flex-start'}}>
		                    <p style={{marginLeft:'0px', marginRight:'0px'}}>Metamask address: {ethAccount}</p>
		                    <Popup trigger={<Icon color='blue' name="help" size='small' />}
		                           header="Metamask Address"
		                           content="This is the address that is selected in Metamask. To change it, select a different address in Metamask"/>
	                    </div>
                        }
                        {
                            displayMetamaskConnect && metaMaskAvailable && <Button color='blue' as='a'
                               onClick={(_) => props.interactiveMetamaskConnect}>Select an account in metamask</Button>
                        }

                        {!ethSignature && !displayMetamaskConnect &&
	                    <div style={{display:'flex', alignItems:'flex-start'}}>
		                    <Button color="blue" basic onClick={(_) => signEthAddressClickHandler()}>Use this address</Button>
		                    <Popup trigger={<Icon color='blue' name="help" size='small' />}
		                           content="Click this button to sign your cmail account name and your payment address in Metamask. This proves you own your payment address and associates it with your cmail account. You do not pay anything when you do this in Metamask."/>
	                    </div>
                        }
                        {!ethSignature && !metaMaskAvailable &&
	                    <Message error>
		                    <MessageHeader>
			                    🦊&nbsp;&nbsp;Metamask Not Available
		                    </MessageHeader>
		                    <MessageContent style={{marginTop:'10px'}}>
			                    The Metamask browser extension is not available. Please enable it for your browser and try again. Metamask is available for Chrome, Firefox and Brave.
		                    </MessageContent>
	                    </Message>
                        }
                    </ItemGroup>)
            },
        },
    ]

    const openPriceEditor = [
        {
            key: 'details',
            title: 'Edit',
            content: {
                content: (
                    <ItemGroup>
                    <Input required={true}
                                   label='Open Inbox Message Price'
                                   fluid
                                   type='text'
                                   placeholder='0.0001'
                                   id='form-open-price'
                                   key='open-price'
                                   value = {openPriceInput}
                                   onChange={(e: any) => setOpenPriceInput(e.target.value)}
                                   >
                    <Label color='green'>My open message price</Label>
                    <input  />
                    <Label color='green'>
                        <Icon name="ethereum"/>
                        ETH</Label>
                    <Popup trigger={<Icon color='blue' name="help" size='small' />}
                           header="Open Message Price"
                           content="Specify the amount of ether you want to charge as payment for opening and reading a new incoming cmail message from another user."/>
                    </Input>
                { isOpenPriceInputInvalid() && <Message error>Please enter a numerical amount for the open price. e.g. 0.0001</Message>}
                    </ItemGroup>)
            },
        },
    ]

    const replyPriceEditor = [
        {
            key: 'details',
            title: 'Edit',
            content: {
                content: (<ItemGroup><Input required={true}
                                    style={{ marginTop: '10px' }}
                                    type='text'
                                    label='Reply Inbox Message Price'
                                    fluid
                                    placeholder='0.0002'
                                    id='form-reply-price'
                                    key='reply-price'
                                    value = {replyPriceInput}
                                    onChange={(e: any) => setReplyPriceInput(e.target.value)}>
                        <Label color='orange'>My reply to a message price</Label>
                        <input />
                        <Label color='orange'>
                            <Icon name="ethereum"/>
                            ETH</Label>
                        <Popup trigger={<Icon color='blue' name="help" size='small' />}
                               header="Reply Price"
                               content="Specify the amount of ether you want to charge as payment for reading and replying to a new incoming cmail message from another user"/>
                    </Input>
                        { isReplyPriceInputInvalid() && <Message error>Please enter a numerical amount for the reply price. e.g. 0.0001</Message>}
                    </ItemGroup>
                )
            },
        },
    ]

    return (<TabPane>
                <Header><Icon name='ethereum'/>Your Attention Prices</Header>
                <SegmentGroup>
                    <Segment>
                        <h4>Ethereum payment address</h4>
                        <Popup content={'Browse your payment address on Etherscan'} trigger={
                            <a href={etherScanAddress} target='_blank' rel='noopener noreferrer'>{ethAddress}</a>
                        }/>
                        <Accordion as={FormField} panels={changeEthAddressEditor} />
                    </Segment>
                    <Segment>
                        <h4>Pay to open price</h4>
                        <Popup header='Open Price' content={getPayToOpenPopupText()} trigger={
                            <Label size='large' color='green' tag><Icon name="ethereum"/>{formatWeiAmount(openPrice)}</Label>
                        }/>
                        <Accordion as={FormField} panels={openPriceEditor} />
                    </Segment>
                    <Segment>
                        <h4>Pay to reply price</h4>
                        <Popup header='Reply Price' content={getPayToReplyPopupText()} trigger={
                            <Label size='large' color='orange' tag><Icon
                                name="ethereum"/>{formatWeiAmount(replyPrice)}</Label>
                        }/>
                        <Accordion as={FormField} panels={replyPriceEditor} />
                    </Segment>
                    {displaySaveButton() && <Segment attached >
                            <Button onClick={(_) => onSaveButtonClicked()} disabled={!saveButtonEnabled()} color='blue'>Save Changes</Button>
                    </Segment> }
                </SegmentGroup>
            </TabPane>)
}

export default PaymentSettings
