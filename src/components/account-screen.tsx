// @ts-ignore
import React from 'react'
import {useEffect} from 'react'
import {useAppDispatch, useAppSelector} from '../app/hooks'
import {
    Button,
    Container,
    Icon, Image, ItemGroup, Label,
    Message,
    MessageContent,
    MessageHeader, Popup,
    Segment
} from 'semantic-ui-react'
import {getPublicAccountInfoAction} from '../features/public-accounts/public-accounts-server-api'
import {GetAccountRequest} from '../proto/api/api_types_pb'
import {base64Decode} from '@polkadot/util-crypto'
import {Account} from '../proto/types/accounts_pb'
import {useHistory, useRouteMatch} from 'react-router-dom'
import {setAccounts} from '../features/public-accounts/public-accounts-slice'
import {OptionalAccount, OptionalString} from '../common/types'
import {OptionalAppError, setLastError} from '../features/app/app-slice'
import {Redirect} from 'react-router'
import UserCard from './user-card'
import Footer from './navigation/footer'

interface AccountByNameScreenProps {
    localAccount: OptionalAccount
}
function AccountByNameScreen(props: AccountByNameScreenProps) {

    const dispatch = useAppDispatch()
    const history = useHistory()

    // account name in url

    const account: OptionalAccount = useAppSelector((state) => {
        for (const data of state.pub_accounts.accounts) {
            return Account.deserializeBinary(base64Decode(data))
        }
        return null
    })

    const match = useRouteMatch("/u/:name")
    const name : OptionalString = match ? match.params['name'] : null

    // if lastError then account not found by name
    const lastError : OptionalAppError = useAppSelector((state) => state.app.last_error)

    useEffect(() => {
        if (name === null) {
            return
        }

        dispatch(setLastError(null))
        dispatch(setAccounts(new Array<string>()))

        document.title = "CMAIL - " + name
        const request = new GetAccountRequest()
        request.setName(name)
        dispatch(getPublicAccountInfoAction(request))
    }, [dispatch, name])

    function sendMessageClicked() {
        history.push('/compose?to=' + name)
    }

    function signUpClicked() {
        history.push('/signup')
    }

    function onBrowseAllUserClicked() {
        history.push('/users')
    }

    ///////////////////

    if (name === null) {
        // unexpected path
        return <Redirect to="/" />
    }

    if (lastError !== null) {
        return (<Container style={{opacity: '85%', marginTop: '24px', textAlign: 'center'}}>
            <Message attached>
                <MessageHeader><h2>{name} is not on cmail yet...</h2></MessageHeader>
            </Message>
            <Segment attached>
                <Button color='blue' onClick={(_) => onBrowseAllUserClicked()}><h3>Browse available users</h3></Button>
                <Image centered style={{maxWidth:'50%', marginTop:'24px', marginBottom:'24px'}} src="/avatar_large.jpg"/>
            </Segment>
            <Segment>
                <Footer/>
            </Segment>
        </Container>)
    }

    if (account === null) {
        return (<Container style={{opacity: '85%', marginTop: '24px', textAlign: 'left'}}>
            <Message attached>
                <MessageContent>Loading...</MessageContent>
            </Message>
        </Container>)
    }

    return (
        <Container style={{opacity: '85%', marginTop: '24px', paddingBottom:'40px', textAlign: 'center'}}>
            <Message attached>
                <MessageHeader><h2>{name} is on cmail</h2></MessageHeader>
            </Message>
            <Segment attached>
                {props.localAccount === null && <ItemGroup>
                <h3>Sign up to cmail to send {name} a paid message.</h3>
	                <Popup content={'Sign-up to cmail and get 100 cmail tokens for becoming our bestie.'}
	                       trigger={
                                   <Button onClick={(_) => signUpClicked()} color='blue'>Sign Up
                                       <Label style={{position: 'relative', top: '-18px', left: '32px', color: 'white'}}
                                              size='tiny' color='red' floating>+100</Label>
                                   </Button>
                           }/>
                </ItemGroup>
                }
                {props.localAccount !== null &&
	            <Popup content={'Get 100 cmail tokens for sending a paid to open or paid to reply message.'}
	                   trigger={
                           <Button onClick={(_) => sendMessageClicked()} color='green'>
                               <Icon name="pencil alternate"/>Send {name} a Message
                               <Label style={{position: 'relative', top: '-18px', left: '32px', color: 'white'}}
                                      size='tiny' color='red' floating>+100</Label>
                           </Button>
                       }/>
                }
            </Segment>
            <Segment attached style={{display:'flex', justifyContent:'center'}}>
                <UserCard clickable={false} user={account}/>
            </Segment>
            <Segment>
                <Footer/>
            </Segment>
        </Container>)
}


export default AccountByNameScreen


