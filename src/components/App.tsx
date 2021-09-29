// @ts-ignore
import React, {useCallback} from 'react'
import './App.css'
import {Container, Modal} from 'semantic-ui-react'
import {Redirect, Route, Switch} from 'react-router'
import SignIn from './account/signin'
import {useAppDispatch, useAppSelector} from '../app/hooks'
import UserMenu from './navigation/user-menu'
import GuestMenu from './navigation/guest-menu'
import SignUp from './account/signup'
import Settings from './account/settings'
import About from './guests/about'
import ErrorMessage from './error-message'
import CryptoUtils from '../features/crypo/crypto'
import WelcomePage from './guests/welcome'
import {useEffect, useState} from 'react'
import RestoreAccount from './account/restore'
import ThreadboxScreen from './thread-boxes/thread-box'
import {ThreadBoxType} from '../proto/types/content_pb'
import AllAccountsScreen from './direcotry'
import NewThreadComposer from './new-thread-composer'
import {updateAccount, updateChainId} from '../features/ethereum/ethereum-slice'
import {connectEthereum, initEthereum} from '../features/ethereum/ethereum-thunks'
import {MessageData, OptionalAccount, OptionalMessageData} from '../common/types'
import {useHistory} from 'react-router-dom'
import ReplyComposer from './reply-composer'
import {Account} from '../proto/types/accounts_pb'
import {base64} from 'ethers/lib/utils'
import BackgroundSelector, {backgrounds} from './navigation/bacground-selector'
import Terms from './guests/terms'
import AccountByNameScreen from './account-screen'
import Faq from './guests/faq'
import {getEthPrice} from '../features/ethereum/get-fiat-price'

// Main app component
function App() {
    const dispatch = useAppDispatch()
    const history = useHistory()

    const [cryptoLibReady, setCryptoLibReady] = useState(false)

    // message user asked to compose a reply to from any sub component
    const [repliedMessageData, setRepliedMessageData] = useState(null as OptionalMessageData)
    const [localAccount, setLocalAccount] = useState(null as OptionalAccount)
    const [backgroundMediaUrl, setBackgroundMediaUrl] = useState(backgrounds[0].url)
    // todo: figure out why useEffect is not always called when state.account.account

    const accountState = useAppSelector((state) => state.account.account)

    useEffect( () => {
        console.log("👋 App use effect: account changed - updating local account....")
        if (accountState === null) {
            setLocalAccount(null)
            return
        }
        setLocalAccount(Account.deserializeBinary(base64.decode(accountState)))
    }, [accountState])

    const handleChainChangeCallback = useCallback(
        (chain: String) => {
            console.log("App: onChainChanged...")
            if (chain.length === 0) {
                dispatch(updateChainId(null))
                return
            }

            const chainId : number = Number(chain)
            console.log("⛓ Ethereum chain id: " + chainId)
            dispatch(updateChainId(chainId))
        }, [dispatch])

    const handleAccountsChangedCallback = useCallback(
        (accounts: string[]) => {
            console.log("App: onEthAccountsChanged...")

            async function checkChainId () {
                const chainId: string = await (window as any).ethereum.request({method: 'eth_chainId'})
                handleChainChangeCallback(chainId)
            }
            checkChainId()

            if (accounts.length === 0 || accounts[0] === "0") {
                // MetaMask is locked or the user has not connected any accounts
                console.log("🦊 No unlocked account available. Please connect to MetaMask.")
                dispatch(updateAccount(null))
                return
            }

            const account = accounts[0] // todo: change state of account to account string
            console.log("🦊 Metamask is unlocked for this app. Unlocked account: " + account)
            dispatch(updateAccount(account))
        }, [dispatch, handleChainChangeCallback])

    ////////////////////

    // A user asked form a component to compose a reply to a message
    function replyToMessageAction(data: MessageData) {
        setRepliedMessageData(data)
        history.push('/reply')
        // todo: navigate to composer
    }

    useEffect( () => {
        if (cryptoLibReady) {
            console.log("🔐 crypto lib is already ready")
            return
        }

        try {
            async function waitReady() {
                await CryptoUtils.waitReady()
            }
            waitReady().then( () => {
                console.log("🔐 crypto lib is ready")
                setCryptoLibReady(true)
            })
        } catch (error) {
            console.log("failed to init crypto lib: " + error)
        }

    }, [dispatch, cryptoLibReady, setCryptoLibReady])

    useEffect( () => {
        console.log("👋 New app session: initializing ethereum...")
        dispatch(initEthereum({
            accountChanged: handleAccountsChangedCallback,
            chainChanged: handleChainChangeCallback
        }))

        dispatch(getEthPrice({symbol: "USD",}))

        // todo: if user is signed-in then how to update account with latest server info on new app session?


    }, [dispatch, handleChainChangeCallback, handleAccountsChangedCallback])

    async function interactiveMetamaskConnect() {
        dispatch(connectEthereum({
            accountChanged: handleAccountsChangedCallback,
            chainChanged: handleChainChangeCallback
        }))
    }

    function setBackgroundUrl(url: string) {
        console.log("set bcg url: " + url)
        setBackgroundMediaUrl(url)
    }

    ///////////////////////////////

    return (
        <Container className="App" fluid={true} style={{ padding: '0 !important', margin: '0 !important',
            backgroundImage: `url(${backgroundMediaUrl})`, backgroundRepeat: 'no-repeat', backgroundPositionX: 'center',
            backgroundPositionY: 'center', backgroundAttachment: 'fixed', backgroundColor: 'black',
        }}>
            { localAccount !== null && <UserMenu user={localAccount}/>}
            { localAccount == null && <GuestMenu/>}
            <Container fluid={true} style={{ paddingTop: '40px'}}>
                <ErrorMessage/>
                {!cryptoLibReady &&
                    <Container fluid={true} textAlign='left'>
                        <Modal size='small'>
                            <Modal.Header>CMAIL</Modal.Header>
                            <Modal.Content>Please wait, cmail is loading...</Modal.Content>
                        </Modal>
                    </Container>
                }
                <BackgroundSelector setBackgroundUrl={setBackgroundUrl}/>
                {cryptoLibReady &&
                    <Switch>
	                    <Route path="/u/:name" render={(_) =>
                            (<AccountByNameScreen localAccount={localAccount}/>)}/>

                        <Route path="/users" component={AllAccountsScreen}/>
	                    <Route path="/faq" component={Faq}/>
                        <Route path="/welcome" render={(_) =>
                            (<WelcomePage localAccount={localAccount}/>)
                        }/>
	                    <Route path="/terms" component={Terms}/>

                        <Route path="/signin" component={SignIn}/>
	                    <Route path="/restore" component={RestoreAccount}/>

                        <Route path="/signup"
                               render={(_) =>
                                   (<SignUp interactiveMetamaskConnect={interactiveMetamaskConnect}/>)
                               }/>

                        <Route path="/settings"
                                render={(_) =>
                                (<Settings localAccount={localAccount}
                                 interactiveMetamaskConnect={interactiveMetamaskConnect}
                                />)}/>

	                    <Route path="/compose"
                               render={(_) =>
                                   (<NewThreadComposer
                                       localAccount={localAccount}
                                       interactiveMetamaskConnect={interactiveMetamaskConnect}/>)
                               }/>

	                    <Route path="/reply"
	                           render={(_) =>
                                   (<ReplyComposer
                                       localAccount={localAccount}
                                       repliedMessageData={repliedMessageData}
                                       interactiveMetamaskConnect={interactiveMetamaskConnect}/>)
                               }/>

                        <Route path="/inbox"
                               render={(_) =>
                                   (<ThreadboxScreen
                                       localAccount={localAccount}
                                       replyToMessageAction={replyToMessageAction}
                                       interactiveMetamaskConnect={interactiveMetamaskConnect} boxType={ThreadBoxType.THREAD_BOX_TYPE_INBOX}/>)
                               }/>

	                    <Route path="/archive"
	                           render={(_) =>
                                   (<ThreadboxScreen
                                       localAccount={localAccount}
                                       replyToMessageAction={replyToMessageAction}
                                       interactiveMetamaskConnect={interactiveMetamaskConnect} boxType={ThreadBoxType.THREAD_BOX_TYPE_ARCHIVE}/>)
                               }/>

	                    <Route path="/sent"
	                           render={(_) =>
                                   (<ThreadboxScreen
                                       localAccount={localAccount}
                                       replyToMessageAction={replyToMessageAction}
                                       interactiveMetamaskConnect={interactiveMetamaskConnect} boxType={ThreadBoxType.THREAD_BOX_TYPE_SENT}/>)
                               }/>

                        <Route path="/about" component={About}/>
                        <Redirect to="/welcome" from="/"/>
                    </Switch>
                }
            </Container>
        </Container>
    )
}

export default App
