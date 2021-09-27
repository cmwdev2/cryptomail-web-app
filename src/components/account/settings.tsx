// @ts-ignore
import React, {useState} from 'react'
import {
    Container, Divider, Header, Icon,
    Label,
    Segment, SegmentGroup, Tab, TabPane
} from 'semantic-ui-react'
import {useEffect} from 'react'
import {useAppSelector} from '../../app/hooks'
import {OptionalAccount} from '../../common/types'
import {Redirect} from 'react-router'
import CryptoUtils from '../../features/crypo/crypto'
import UserCard from '../user-card'
import Footer from '../navigation/footer'
import PaymentSettings from './payment-settings'
import ProfileSettings from './profile-settings'

interface SettingsProps {
    localAccount: OptionalAccount
    interactiveMetamaskConnect: () => void
}

function Settings(props: SettingsProps) {

    // const dispatch = useAppDispatch()

    const [profileUlr, setProfileUrl] = useState("")

    const mnemonic : string = useAppSelector((state) => {
        if (state.account.seed === null) {
            return ""
        }
        return CryptoUtils.seedToMnemonic(state.account.seed as string)
    })

    useEffect(() => {
        if (props.localAccount === null) {
            return
        }

        const account_info = props.localAccount.getPublicAccountInfo()!
        const name = account_info.getName()

        document.title = "CMAIL - Account Settings"

        const profileUrl = window.location.protocol + '//' + window.location.host + "/u/" + name
        setProfileUrl(profileUrl)

    }, [props.localAccount])


    if (props.localAccount === null) {
        return <Redirect to='/'/>
    }

    const panes = [
        { menuItem: 'Account', render: () => <TabPane>
                <Header><Icon name='globe'/>Your account url</Header>
                <p><a target='_blank' rel='noreferrer' href={profileUlr} style={{fontSize:'larger'}}>{profileUlr}</a></p>
                <p>Share this url with anyone you'd like to receive paid messages from.</p>
                <Divider/>
                <Header><Icon name='user'/>How others see you</Header>
                <UserCard user={props.localAccount!} clickable={true}/>
            </TabPane> },
        { menuItem: 'Profile', render: () => <ProfileSettings localAccount={props.localAccount}/> },
        { menuItem: 'Payments', render: () => <PaymentSettings
                localAccount={props.localAccount}
                interactiveMetamaskConnect={props.interactiveMetamaskConnect}/>},
        { menuItem: 'Security', render: () =>
                <TabPane>
                    <Header><Icon name='lock'/>
                        Security Settings</Header>
                    <SegmentGroup>
                        <Segment>
                            <h4><Icon name='user secret'/>Secret Words</h4>
                            <Label style={{fontSize:'larger'}} color='orange'>{mnemonic}</Label>
                            <p><Icon name='checkmark' color='green'/>Save these words in your password manager. You will need them to sign-in from another device or browser.</p>
                        </Segment>
                    </SegmentGroup>
                </TabPane> },
    ]

    return (<Container textAlign='left' style={{marginTop:'10px', paddingBottom:'36px'}}>
        <SegmentGroup>
            <Segment>
                <Header>Settings</Header>
            </Segment>
            <Segment>
                <Tab menu={{ fluid: true, vertical: true, tabular: true }}
                     menuPosition='left'
                     panes={panes}/>
            </Segment>
        </SegmentGroup>
        <SegmentGroup>
            <Segment>
                <Footer/>
            </Segment>
        </SegmentGroup>
    </Container>)
}

export default Settings
