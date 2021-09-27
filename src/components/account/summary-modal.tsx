// @ts-ignore
import React from 'react'

import {
    Button,
    Message,
    Modal,
    Icon,
    Segment, ItemGroup, Item, Label, ModalHeader, ModalContent, MessageHeader, MessageContent
} from 'semantic-ui-react'

interface SummaryModalProps {
    shouldOpen: boolean
    opneCallback: () => void
    accountName: string,
    password: string,
    mnemonic: string,
    onDoneClicked: () => void
}

function SummaryModal(props: SummaryModalProps) {

    const profileUrl = window.location.protocol + '//' + window.location.host + "/u/" + props.accountName

    return (
        <Modal onOpen={props.opneCallback} open={props.shouldOpen} size='small'>
            <ModalHeader>Welcome {props.accountName} to your new account!</ModalHeader>
            <ModalContent>
                <Message>
                    <MessageHeader>You public account url</MessageHeader>
                    <MessageContent style={{marginTop:'10px'}}>
                        <Label style={{fontSize:'larger'}} color='orange'>{profileUrl}</Label>
                    </MessageContent>
                    <ItemGroup style={{marginTop:'20px'}}>
                            <Item>
                                <Icon name='checkmark' color='green'/>Share your account url with people who you want to send you paid cmail messages.
                            </Item>
                            <Item>
                                <Icon name='checkmark' color='green'/>Add your account url to your legacy social media profiles.
                            </Item>
                    </ItemGroup>

                </Message>
                <Message>
                    <MessageHeader>For your records</MessageHeader>
                    <MessageContent>Please take a moment and save your account information in your password manager.</MessageContent>
                    <Segment attached textAlign='left' style={{marginTop:'10px'}}>
                        Account Name<b style={{marginLeft:'10px'}}>{props.accountName}</b>
                    </Segment>
                    <Segment attached>
                        Account url <b style={{marginLeft:'10px'}}>{profileUrl}</b>
                    </Segment>
                    <Segment attached textAlign='left'>
                        Password<b style={{marginLeft:'10px'}}>{props.password}</b>
                    </Segment>
                    <Segment attached textAlign='left'>
                        <ItemGroup>
                            <Item>Secret 12 words</Item>
                            <Item>
                                <Label style={{backgroundColor:'#eeeeee', fontSize:'larger'}}>{props.mnemonic}</Label>
                            </Item>
                        </ItemGroup>
                    </Segment>
                <ItemGroup>
                    <Item><span><Icon name='checkmark' color='green'/>Sign in to your account on this device using your <b>account name</b> and <b>password</b>.</span></Item>
                    <Item><span><Icon name='checkmark' color='green'/>To sign in on another device you need to restore your account from your <b>secret 12 words.</b></span></Item>
                </ItemGroup>
                </Message>
            </ModalContent>
            <Modal.Actions>
                <Button icon labelPosition='right' color="blue" onClick={props.onDoneClicked}><Icon name='angle right' />Go to my inbox</Button>
            </Modal.Actions>
        </Modal>
    )
}

export default SummaryModal
