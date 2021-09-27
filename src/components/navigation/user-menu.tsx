// @ts-ignore
import React, {useEffect} from 'react'

import {
    Button,
    Dropdown, DropdownDivider,
    DropdownItem,
    DropdownMenu,
    Icon, Image,
    Label,
    Menu,
    MenuItem,
    MenuMenu,
    Popup
} from 'semantic-ui-react'
import {useAppDispatch, useAppSelector} from '../../app/hooks'
import {logout} from '../../features/account/signout'
import {useState} from 'react'

import {Link, useHistory} from 'react-router-dom'
import {Account} from '../../proto/types/accounts_pb'

interface UserMenuProps {
    user: Account, // the thread this card displays with all messages and senders info authenticated and decrypted
}

function UserMenu(props: UserMenuProps) {
    const history = useHistory()
    const dispatch = useAppDispatch()


    function signOutClicked() {
        console.log("sign out clicked")
        dispatch(logout())
    }

    const unreadCount = useAppSelector((state) => state.messages.unread_count)
    // const ethChainId = useAppSelector((state) => state.ethereum.chainId)
    // const ethChainDisplayString = ethChainId === 1 ? "Mainnet" : "Testnet " + ethChainId
    // const ethChainLabelColor = ethChainId === 1 ? 'blue' : 'orange'
    const [activeThreadbox, setActiveThreadbox] = useState('inbox')
    const [localUserName, setLocalUserName] = useState("")
    const [smallProfileImageUrl, setSmallProfileImageUrl] = useState("")

    function setNewActiveItem(item: string) {
        setActiveThreadbox(item)
        if (item.length > 0 && history.location.pathname !== '/' + item) {
            history.push('/' + item)
        }
    }

    function settingsClicked() {
        if (history.location.pathname !== '/settings') {
            setActiveThreadbox("")
            history.push('/settings')
        }
    }

    function newMessageClicked() {
        if (history.location.pathname !== '/compose') {
            setActiveThreadbox("")
            history.push('/compose')
        }
    }

    function aboutClicked() {
        if (history.location.pathname !== '/about') {
            setActiveThreadbox("")
            history.push('/about')
        }
    }

    useEffect( () => {
        const accountName = props.user.getPublicAccountInfo()!.getName()
        setLocalUserName(accountName)
        const smallProfileImageUrl = props.user.getPublicAccountInfo()!.getSmallProfileImageUrl()
        setSmallProfileImageUrl(smallProfileImageUrl)
    }, [props.user])

    // metamask net indicator:
    //  { ethChainId > 0  && <Menu.Item><Label color={ethChainLabelColor}>{ethChainDisplayString}</Label></Menu.Item> }


    return (
        <Menu fixed='top' stackable fluid={true} primary="true" style={{opacity: '80%'}}>
                <MenuItem link header as='a' href="./"><Icon name="users" size="large"/>CMAIL
                </MenuItem>
            <Popup header='Compose a new message' content='Get 100 cmail tokens for this action.' trigger={
                <MenuItem>
                    <Button onClick={newMessageClicked} color='green'>
                        <Icon name="pencil alternate"/>New Message</Button>
                        <Label size='tiny' color='red' floating style={{top:'3px', left:'85%', color:'white'}}>+100</Label>
                </MenuItem>
            } />
            <MenuMenu>
                <Popup content='Open your inbox' trigger={
                    <MenuItem name='inbox'
                               active={activeThreadbox === 'inbox'}
                               onClick={() => setNewActiveItem('inbox')}>
                        <Icon color='blue' name='mail outline'/>Inbox
                        {unreadCount > 0 && <Label color='red'>{unreadCount}</Label>}
                    </MenuItem>
                } />
                <Popup content='Browse your archived messages' trigger={
                        <MenuItem
                            name='archive'
                            active={activeThreadbox === 'archive'}
                            content='Archive'
                            icon='box'
                            onClick={() => setNewActiveItem('archive')}
                        />
                    } />

                <Popup content='Browse your sent messages' trigger={
                    <MenuItem
                        name='sent'
                        active={activeThreadbox === 'sent'}
                        content='Sent'
                        icon='envelope open outline'
                        onClick={() => setNewActiveItem('sent')}
                    />
                } />
                <Popup content='Browse the public cmail users directory' trigger={
                    <MenuItem as={Link} to='/users' name='users' style={{color:'blue'}} content="Who's here?"
                    />
                } />
                </MenuMenu>
                <MenuMenu position='right'>
                    <Menu.Item><Label color='orange'>Kovan Testnet</Label></Menu.Item>
                    <MenuItem>
                        <Image size='large' style={{height:'auto', borderRadius:'50%', whiteSpace:'nowrap', fontSize:'large', width:'32px'}} src={smallProfileImageUrl} circular/>
                        <Dropdown style={{marginLeft:'6px'}} header="true" text={localUserName} fluid={true} floating>
                        <DropdownMenu>
                            <DropdownItem icon="settings" onClick={settingsClicked} text='Settings' />
                            <DropdownItem icon="help" onClick={aboutClicked} text='About' />
                            <DropdownDivider />
                            <DropdownItem icon="sign out" text='Sign Out' onClick={signOutClicked} />
                        </DropdownMenu>
                    </Dropdown>
                    </MenuItem>
                </MenuMenu>
        </Menu>
    )
}

export default UserMenu
