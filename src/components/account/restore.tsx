// @ts-ignore
import React from 'react'

import {useEffect, useState} from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {Container, Button, Segment, Form, Message, Checkbox, Popup, Icon} from 'semantic-ui-react'
import {restoreAccount} from '../../features/account/signin'
import {Redirect} from 'react-router'
import {setLastError} from '../../features/app/app-slice'

function RestoreAccount() {

    const dispatch = useAppDispatch()

    useEffect(() => {
        document.title = "CMAIL - Sign In"

        // todo: verify this is only called once
        console.log("clearing last error on signin load...")
        dispatch(setLastError(null))
    }, [dispatch])

    // account name stored in state
    const accountName : string = useAppSelector((state) => {
        if (state.account.name !== null) {
            return state.account.name as string
        } else {
            return ""
        }
    })

    const isSignedIn : boolean = useAppSelector((state) =>
        // User is signed-in only when we have encrypted seed and account name
        state.account.seed != null &&
        state.account.key_pair != null &&
        state.account.account != null &&
        state.account.name != null
    )

    const [accountNameInput, setAccountNameInput] = useState(accountName)
    const [passwordInput, setPasswordInput] = useState("")
    const [keepSignIn, setKeepSignIn] = useState(true)
    const [mnemonicInput, setMnemonicInput] = useState("")


    function onAccountMnemonicInputChanged(event: any) {
        setMnemonicInput(event.target.value)
    }

    function onAccountNameInputChanged(event: any) {
        setAccountNameInput(event.target.value)
    }

    function onPasswordInputChanged(event: any) {
        setPasswordInput(event.target.value)
    }

    function onKeepSignInCheckChanged(value: boolean) {
        setKeepSignIn(value)
    }

    // todo: verify mnemonic when user zooms out of 12 secret words field

    // surprise paddle lottery wire feature tell dust kit enjoy trap inflict machine

    async function restoreAccountClicked() {
        dispatch (restoreAccount({
            name: accountNameInput,
            password: passwordInput,
            mnemonic: mnemonicInput,
            keep_signed_in: keepSignIn
        }))
    }

    return (
        <Container fluid={true} textAlign='left' style={{marginTop:'20px'}}>
            {isSignedIn && <Redirect to="/" />}

	        <Container style={{paddingTop: '42px', opacity: '80%'}} text>
                <Message
                    attached
                    header='Sign in to your account'
                    content='You need to enter your account 12 secret words to sign-in on this device'/>
		        <Segment attached>
                    <Form>
                        <div style={{display:'flex', alignItems:'flex-start'}}>
                        <Form.Input required={true}
                                    width={15}
                                    label='Account Name'
                                    icon='user'
                                    iconPosition='left'
                                    placeholder='Your account name'
                                    id='form-restore-name'
                                    value = {accountNameInput}
                                    onChange={onAccountNameInputChanged}/>
                        <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'0px', marginTop: '20px'}} />}
                               header="Account Password"
                               content=""/>
                        </div>
                        <Form.Field>
                            <div style={{display:'flex', alignItems:'flex-start'}}>
                                <Form.Input required={true}
                                            width={15}
                                            fluid
                                            icon='user secret'
                                            iconPosition='left'
                                            label='Account 12 secret words'
                                            placeholder='Use the 12 words you saved when you created your account'
                                            id='form-restore-words'
                                            value = {mnemonicInput}
                                            type = "password"
                                            onChange={onAccountMnemonicInputChanged}/>
                                <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'0px', marginTop: '20px'}} />}
                                       header="Account Password"
                                       content=""/>
                            </div>

                        </Form.Field>
                        <Form.Field>
                            <div style={{display:'flex', alignItems:'flex-start'}}>
                            <Form.Input required={true}
                                    width={15}
                                    fluid
                                    label='New password'
                                    type='password'
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Enter a new password for your account'
                                    id='form-input-restore-password'
                                    value = {passwordInput}
                                    onChange={onPasswordInputChanged}/>
                            <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'0px', marginTop: '20px'}} />}
                                   header="Account Password"
                                   content=""/>
                            </div>
                        </Form.Field>
                        <Form.Field>
                            <div style={{display:'flex', alignItems:'flex-start'}}>
                            <Checkbox label="Keep me signed in on this device" checked={keepSignIn} onChange={(e,d) => onKeepSignInCheckChanged(d.checked!)}/>
                            <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'0px', marginTop: '0px'}} />}
                                   header="Account Password"
                                   content=""/>
                            </div>
                        </Form.Field>
                        <Button onClick={restoreAccountClicked} type="submit" primary={true}>Sign In</Button>
                    </Form>
		        </Segment>
                <Message attached='bottom' info>
                    No account yet? <a href='/signup'>Sign up</a>
                </Message>
	        </Container>
        </Container>
    )
}

export default RestoreAccount
