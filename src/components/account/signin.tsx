// @ts-ignore
import React from 'react'

import {useEffect, useState} from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {GetAccountRequest} from '../../proto/api/api_types_pb'
import {Container, Button, Segment, Checkbox, Form, Message, Grid, Popup, Icon} from 'semantic-ui-react'
import {interactiveLogin} from '../../features/account/signin'
import {Redirect} from 'react-router'
import {OptionalAppError, setLastError} from '../../features/app/app-slice'
import {grpc} from '@improbable-eng/grpc-web'
import {getPublicAccountInfoAction} from '../../features/public-accounts/public-accounts-server-api'
import {setAccounts} from '../../features/public-accounts/public-accounts-slice'

function SignIn() {

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

    const canSignIn : boolean = useAppSelector((state) =>
    {
        // User can sign in only if has an enc seed in account state and an account name
        if (state.account.enc_seed !== null && state.account.name !== null) {
            return state.account.name.length > 0
        }
        return false
    })

    const isSignedIn : boolean = useAppSelector((state) =>
        // User is signed-in only when we have encrypted seed and account name
        state.account.seed != null &&
        state.account.key_pair != null &&
        state.account.account != null &&
        state.account.name != null
    )

    const gotPublicAccountInfo: boolean = useAppSelector((state) => state.pub_accounts.accounts.length > 0)

    const [passwordInput, setPasswordInput] = useState("")
    const [keepSignIn, setKeepSignIn] = useState(true)

    // error states
    const [invalidPassword, setInvalidPassword] = useState(false)
    const [invalidAccountName, setInvalidAccountName] = useState(false)
    const [serverError, setServerError] = useState(false)
    const lastError : OptionalAppError = useAppSelector((state) => state.app.last_error)
    useEffect(() => {
        if (lastError === null) {
            return
        }
        if (lastError!.code === grpc.Code.Unauthenticated || lastError!.code === grpc.Code.Internal) {
            setInvalidPassword(true)
            return
        }
        if (lastError!.code === grpc.Code.NotFound) {
            setInvalidAccountName(true)
            return
        }
        setServerError(true)
    }, [dispatch, lastError])


    function getErrorMessage() {
        if (invalidPassword) {
            return <Message error
                header="Wrong password"
                content='Please enter your correct account password and try again'/>
        }
        if (serverError) {
            return <Message error
                header="Cmail Server Error"
                content="Can't access the cmail server. Please try again later"/>
        }
        if (invalidAccountName) {
            return <Message error
                header="Account Not Found"
                content="There is no cmail account with this name. Please enter your account name and try again"/>
        }
        return null
    }

    function onPasswordInputChanged(event: any) {
        setPasswordInput(event.target.value)
    }

    function onKeepSignInCheckChanged(event: any) {
        setKeepSignIn(event.target.value)
    }

    // We keep a boolean to indicate that signin is in progress
    const [signInInProgress, setSignInInProgress] = useState(false)

    useEffect(() => {
        if (signInInProgress && gotPublicAccountInfo) {
            setSignInInProgress(false)
            console.log("resuming sign-in user operation for account " + accountName + "...")

            dispatch(interactiveLogin({name: accountName, password: passwordInput, keep_signed_in: keepSignIn}))
        }
    }, [dispatch, signInInProgress , gotPublicAccountInfo, keepSignIn, passwordInput, accountName])

    async function signInClicked() {
        setInvalidAccountName(false)
        setInvalidPassword(false)
        setServerError(false)

        if (passwordInput.length === 0) {
            setInvalidPassword(true)
            return
        }

        if (!canSignIn) {
            console.log("can't sign-in expected enc account seed in store")
            return
        }

        if (accountName === null || accountName.length === 0) {
            setInvalidAccountName(true)
            return
        }

        // get the server account info for the name provided by the user
        console.log("Querying server for account info for " + accountName + "...")

        // clear last fetched public account(s)
        dispatch(setAccounts(new Array<string>()))

        const request = new GetAccountRequest()
        request.setName(accountName)
        dispatch(getPublicAccountInfoAction(request))

        // mark this so the flow is resumed when server returned and error or account info
        setSignInInProgress(true)
    }

    function onPasswordBlur() {
        setInvalidPassword(false)
        dispatch(setLastError(null))
    }

    const passwordPopupContent = 'Enter your cmail account password for account ' + accountName

    return (
        <Container fluid={true} textAlign='left' style={{marginTop:'20px'}}>
            {isSignedIn && <Redirect to="/" />}
            {!isSignedIn && !canSignIn && <Redirect to="/restore" />}
            {canSignIn &&
            <Container style={{ paddingTop: '0px', opacity: '80%' }} text>
	            <Message attached>
                    <Message.Header>Welcome back {accountName}</Message.Header>
                    <Message.Content> Enter your account password to sign in.</Message.Content>
                </Message>
                <Segment attached>
                    <Form error>
                            <div style={{display:'flex', alignItems:'flex-start', marginTop: '0px'}}>
                                <Form.Input required={true}
                                width={10}
                                autoFocus
                                label='Password'
                                type='password'
                                icon='lock' iconPosition='left'
                                placeholder='Your account password'
                                id='form-input-account-password'
                                value = {passwordInput}
                                onChange={onPasswordInputChanged}
                                onBlur={() => onPasswordBlur()}/>
                            <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'0px', marginTop: '22px'}} />}
                                   header="Account Password"
                                   content={passwordPopupContent}/>
                            </div>
                        <Form.Field>
	                        <div style={{display:'flex', alignItems:'flex-start'}}>
                                <Checkbox label="Keep me signed in on this device" checked={keepSignIn} onChange={onKeepSignInCheckChanged}/>
                                <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'0px', marginTop: '2px'}} />}
                                       header="Account Password"
                                       content={passwordPopupContent}/>
                            </div>
                        </Form.Field>
                        {getErrorMessage()}
		                <Button type='submit'
                                primary={true}
                                onClick={signInClicked}>Sign In</Button>
                    </Form>
                </Segment>
                <Segment attached>
                <Grid stretched columns="equal">
                    <Grid.Column stretched>
                        <div>No account yet? <a href='/signup'>Sign up</a></div>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <div>Sign in to a <a href='/restore'>different account</a></div>
                    </Grid.Column>
                </Grid>
                </Segment>
            </Container>
            }
        </Container>
    )
}

export default SignIn
