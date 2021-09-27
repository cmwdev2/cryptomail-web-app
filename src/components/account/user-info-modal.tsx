// @ts-ignore
import React, {SetStateAction} from 'react'
import {
    Button,
    Form,
    Modal,
    Popup,
    Icon,
    Divider,
    Checkbox
} from 'semantic-ui-react'

interface UserInfoModalProps {
    shouldOpen: boolean
    onOpenCallback: () => void
    onBackButtonClicked: () => void
    onNextButtonClicked: () => void
    hasLastError: boolean
    signUpInProgress: boolean

    bio: string
    onBioChanged: (value: SetStateAction<string>) => void

    fullName: string
    onFullNameChanges: (value: SetStateAction<string>) => void

    location: string
    onLocationChanged: (value: SetStateAction<string>) => void

    position: string
    onPositionChanged: (value: SetStateAction<string>) => void

    company: string
    onCompanyChanged: (value: SetStateAction<string>) => void

    twitter: string
    onTwitterChanged: (value: SetStateAction<string>) => void

    website: string
    onWebsiteChanged: (value: SetStateAction<string>) => void

    telegram: string
    onTelegramChanged: (value: SetStateAction<string>) => void

    linkedin: string
    onLinkedinChanged: (value: SetStateAction<string>) => void

    accountPublic: boolean
    onAccountPublicChanged: (pub: boolean) => void
}

function UserInfoModal(props: UserInfoModalProps) {

    return (
        <Modal
            onOpen={props.onOpenCallback}
            open={props.shouldOpen}
            size='small'>
            <Modal.Header>Account Information</Modal.Header>
            <Modal.Content>
                Your account can be anonymous, or it can include information you like to share about yourself or your organization. What you share helps others decide if they want to send you a paid message on cmail.
                <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'2px'}} />}
                       header="Anonymous or Personal?"
                       content="Adding personal or professional information to your account enables others to verify who you are before sending you a paid message. Account information provides helpful context to messages you send to other users on cmail."/>
                <Form error style={{marginTop:'16px'}}>
                    <Form.Input width={16}
                        autoFocus
                        type='text'
                        placeholder='About yourself or your organization'
                        id='form-input-bio'
                        value = {props.bio}
                        onChange={(e) => props.onBioChanged(e.target.value)}
                        key='bio'
                        label='Bio'
                        icon="pencil"
                        color="blue"
                        iconPosition="left"/>
                    <Form.Group fluid={true}>
                        <Form.Input width={8}
                            type='text'
                            placeholder='Your full name. e.g. John Doe'
                            id='form-input-full-name'
                            value = {props.fullName}
                            key='fn'
                            icon="user"
                            iconPosition="left"
                            label= 'Full Name'
                            onChange={(e) => props.onFullNameChanges(e.target.value)}
                        />
                        <Form.Input width={8}
                            type='text'
                            placeholder='City / Region / Country'
                            id='form-input-lo'
                            value = {props.location}
                            key='location'
                            label= 'Location'
                            icon="globe"
                            iconPosition="left"
                            onChange={(e) => props.onLocationChanged(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group fluid="true">
                        <Form.Input width={8}
                                    type='text'
                                    placeholder='The Awesome Company'
                                    id='form-input-co'
                                    value = {props.company}
                                    key='co'
                                    icon="building"
                                    iconPosition="left"
                                    label= 'Company / Org'
                                    onChange={(e) => props.onCompanyChanged(e.target.value)}
                        />
                        <Form.Input width={8}
                                    type='text'
                                    placeholder='Chief Happiness Officer'
                                    id='form-input-pos'
                                    value = {props.position}
                                    key='position'
                                    label= 'Position'
                                    icon="users"
                                    iconPosition="left"
                                    onChange={(e) => props.onPositionChanged(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group fluid="true">
                        <Form.Input width={8}
                            type='text'
                            placeholder='@myTwitterHandle'
                            id='form-input-tw'
                            value = {props.twitter}
                            key='twitter'
                            label= 'Twitter'
                            icon="twitter"
                            iconPosition="left"
                            onChange={(e) => props.onTwitterChanged(e.target.value)}
                        />
                        <Form.Input
                            width={8}
                            type='text'
                            placeholder='@myTeleggramUserName'
                            id='form-input-tg'
                            value = {props.telegram}
                            key='tgram'
                            label= 'Telegram'
                            icon="telegram plane"
                            iconPosition="left"
                            onChange={(e) => props.onTelegramChanged(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group fluid="true">
                        <Form.Input  width={8}
                            type='text'
                            placeholder='https://mywebsite.wtf'
                            id='form-input-website'
                            value = {props.website}
                            key='web'
                            label= 'Website'
                            icon='home'
                            iconPosition='left'
                            onChange={(e) => props.onWebsiteChanged(e.target.value)}
                        />
                        <Form.Input width={8}
                            type='text'
                            placeholder='https://linkedin.com/in/myprofile'
                            id='form-input-li'
                            value = {props.linkedin}
                            key='linkedin'
                            label= 'LinkedIn'
                            icon="linkedin"
                            iconPosition="left"
                            onChange={(e) => props.onLinkedinChanged(e.target.value)}
                        />
                    </Form.Group>
                    <Divider/>
                        <Checkbox checked={props.accountPublic}
                            onChange={(e, d) => props.onAccountPublicChanged((d.checked!))}
                            label='Make my account visible' />
                    <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'2px'}} />}
                           header="Account Visibility"
                           content="When your account is visible, it is listed on cmail accounts directory and anyone can find your account name and the information you provide about it on this screen. When it is not visible, only people who have your account name can send you a message on cmail."/>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button icon labelPosition='left' onClick={props.onBackButtonClicked}><Icon name='angle left' />Back</Button>
                { (!props.signUpInProgress || props.hasLastError) &&
                <Button onClick={props.onNextButtonClicked}
                        labelPosition='right'
                        icon='arrow right'
                        content='next'
                        color='green'/> }
                { props.signUpInProgress && ! props.hasLastError && <Button loading color='green'>&nbsp;</Button> }
            </Modal.Actions>
        </Modal>
    )
}

export default UserInfoModal
