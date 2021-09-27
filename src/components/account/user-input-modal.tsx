// @ts-ignore
import React, {SetStateAction, useState} from 'react'
import {
    Button,
    Header,
    Form,
    Label,
    Input,
    Modal,
    Popup,
    Icon,
    Divider, Message, MessageContent, MessageHeader
} from 'semantic-ui-react'
import {OptionalString} from '../../common/types'
import {getUsdPriceEstimate} from '../../features/ethereum/utils'

interface UserInputModalProps {
    shouldOpen: boolean
    onOpenCallback: () => void
    // onBackButtonClicked: () => void
    onNextButtonClicked: () => void
    hasLastError: boolean
    signUpInProgress: boolean
    getErrorMessageComponent: () => any

    password: string
    onPasswordChanged: (value: SetStateAction<string>) => void

    accountName: string
    onAccountNameChanged: (value: SetStateAction<string>) => void

    ethAccount: string
    ethSignature: OptionalString
    signEthAddressClickHandler: () => void
    metaMaskAvailable: boolean
    onSignedEthAddressClicked: () => void
    displayMetamaskConnect: boolean
    onConnectEthereumClicked: () => void

    onAccountNameFocusIn: () => void
    onAccountNameFocusOut: () => void

    validateStepOneInput: () => string
    accountAvailabilityCheckInProgress: boolean

    // pricing
    priceOpen: string
    setPriceOpen: (value: SetStateAction<string>) => void
    priceReply: string
    setPriceReply: (value: SetStateAction<string>) => void

}

function UserInputModal(props: UserInputModalProps) {

    const [priceOpenDisp, setPriceOpenDisp] = useState("")
    const [priceReplyDisp, setPriceReplyDisp] = useState("")

    function updateOpenPrice(value: string) {
        props.setPriceOpen(value)
        const numeric = parseFloat(value)
        if (!Number.isNaN(numeric)) {
            setPriceOpenDisp("ETH " + getUsdPriceEstimate(value))
        } else {
            setPriceOpenDisp("ETH")
        }
    }

    function updateReplyPrice(value: string) {
        props.setPriceReply(value)
        const numeric = parseFloat(value)
        if (!Number.isNaN(numeric)) {
            setPriceReplyDisp("ETH " + getUsdPriceEstimate(value))
        } else {
            setPriceReplyDisp("ETH")
        }
    }

    return (
            <Modal size='small'
                open={props.shouldOpen}>
                <Modal.Header>Create a new Account</Modal.Header>
                <Modal.Content>
                        <Form error>
                            <Form.Group widths='equal'>
                                <Form.Input required={true}
                                            fluid
                                            width={4}
                                            label= 'Account name'
                                            placeholder= 'A unique account identified'
                                            id='form-input-account-name'
                                            autoFocus
                                            icon='user'
                                            iconPosition='left'
                                            onBlur={() => props.onAccountNameFocusOut()}
                                            onFocus={() => props.onAccountNameFocusIn()}
                                            value = {props.accountName}
                                            onChange={(e) => props.onAccountNameChanged(e.target.value)}
                                            key='account-name'/>
                                <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'-8px', marginTop: '22px'}} />}
                                       header="Account Name"
                                       content="Cmail account names are unique and is similar to your email address in legacy email apps. To receive messages on cmail, you need to share your account name with other cmail users. Please save your account name in your password manager or notes app"/>
                                <Form.Input required={true}
                                            fluid
                                            width={4}
                                            label='Password'
                                            icon='lock'
                                            iconPosition='left'
                                            type='password'
                                            placeholder='Used to sign-in to your account'
                                            id='form-input-account-password'
                                            value = {props.password}
                                            onChange={(e) => props.onPasswordChanged(e.target.value)}
                                            key='password'/>
                                <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'-8px', marginTop: '22px'}} />}
                                       header="Account Password"
                                       content="You account password protects access to your account on a device. Please save it in a password manager or notes app."/>
                            </Form.Group>
                            <Message info content="Your account name is global, public and can't be changed later. Consider using your Ethereum ens name if you have one for it."/>
                            {props.getErrorMessageComponent()}

                            <div style={{display:'flex', alignItems:'flex-start', marginTop: '36px'}}>
                                <Header as='h4' style={{}}>My Attention Prices</Header>
                                <Popup trigger={<Icon color='blue' name="help" size='small' />}
                                       header="Attention Price"
                                       content="Specify the amount of coins you'd like to receive for an action such as opening a new cmail message or replying to a message."/>
                            </div>
                            <Input required={true}
                                   label='Open Inbox Message Price'
                                   fluid
                                   type='text'
                                   placeholder='0.0001'
                                   id='form-open-price'
                                   key='open-price'
                                   value = {props.priceOpen}
                                   onChange={(e: any) => updateOpenPrice(e.target.value)}>
                                <Label color='green'>My open message price</Label>
                                <input  />
                                <Label color='green'>
                                    <Icon name="ethereum"/>
                                    {priceOpenDisp}</Label>
                                <Popup trigger={<Icon color='blue' name="help" size='small' />}
                                       header="Open Message Price"
                                       content="Specify the amount of ether you want to charge as payment for opening and reading a new incoming cmail message from another user."/>
                            </Input>
                            <Input required={true}
                                   style={{ marginTop: '10px' }}
                                   type='text'
                                   label='Reply Inbox Message Price'
                                   fluid
                                   placeholder='0.0002'
                                   id='form-reply-price'
                                   key='reply-price'
                                   value = {props.priceReply}
                                   onChange={(e: any) => updateReplyPrice(e.target.value)}>
                                <Label color='orange'>My reply to a message price</Label>
                                <input />
                                <Label color='orange'>
                                    <Icon name="ethereum"/>
                                    {priceReplyDisp}</Label>
                                <Popup trigger={<Icon color='blue' name="help" size='small' />}
                                       header="Reply Price"
                                       content="Specify the amount of ether you want to charge as payment for reading and replying to a new incoming cmail message from another user"/>
                            </Input>

                            <div style={{display:'flex', alignItems:'flex-start', marginTop: '36px'}}>
                                <Header as='h4' style={{}}>My Payments Address</Header>
                                <Popup trigger={<Icon color='blue' name="help" size='small' />}
                                       header="Payment Address"
                                       content="Use Metamask to set your payment Ethereum address. This is the address you will receive payments for your attention from other cmail users"/>
                            </div>

                            {props.ethAccount !== null && props.ethAccount !== '' &&
                                <div style={{display:'flex', alignItems:'flex-start'}}>
                                    <p style={{marginLeft:'0px', marginRight:'0px'}}>Metamask address: {props.ethAccount}</p>
                                    <Popup trigger={<Icon color='blue' name="help" size='small' />}
                                           header="Metamask Address"
                                           content="This is the address currently active in Metamask. To change it, select a different address in Metamask"/>
                                </div>
                            }
                            {
                                props.displayMetamaskConnect && props.metaMaskAvailable && <Button color='blue' as='a' onClick={props.onConnectEthereumClicked}>Select an account in metamask</Button>
                            }

                            {!props.ethSignature && !props.displayMetamaskConnect &&
                            <div style={{display:'flex', alignItems:'flex-start'}}>
                                <Button color="orange" onClick={props.signEthAddressClickHandler}>Use this address</Button>
                                    <Popup trigger={<Icon color='blue' name="help" size='small' />}
                                    content="Click this button to sign your cmail account name and your payment address in Metamask. This proves you own your payment address and associates it with your cmail account. You do not pay anything when you do this in Metamask."/>
                            </div>
                            }
                            {!props.ethSignature && !props.metaMaskAvailable &&
                                <Message error>
                                    <MessageHeader>
	                                    🦊&nbsp;&nbsp;Metamask Not Available
                                    </MessageHeader>
                                    <MessageContent style={{marginTop:'10px'}}>
	                                    The Metamask browser extension is not available. Please enable it for your browser and try again. Metamask is available for Chrome, Firefox and Brave.
                                    </MessageContent>
                                </Message>
                            }
                            <Divider/>
                            Already got an account? <a style={{cursor:"pointer"}} href='/signin'>Sign in</a>
                        </Form>
                </Modal.Content>
                <Modal.Actions>
                    { props.accountAvailabilityCheckInProgress && !props.hasLastError && <Button disabled={true} loading color='green'>&nbsp;</Button> }
                    {(!props.accountAvailabilityCheckInProgress || props.hasLastError) && <Button
                        content="Next"
                        labelPosition='right'
                        icon='arrow right'
                        onClick={props.onNextButtonClicked}
                        color='green'
                        disabled={props.validateStepOneInput() !== ""}/>
                    }
                </Modal.Actions>
            </Modal>
    )
}

export default UserInputModal
