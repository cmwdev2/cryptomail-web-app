// @ts-ignore
import React from 'react'

import {Icon, Label, Menu, MenuItem, MenuMenu, Popup} from 'semantic-ui-react'
import {useAppSelector} from '../../app/hooks'
import {Link} from 'react-router-dom'

function GuestMenu() {

    // based on metamask label:
    //    { ethChainId > 0  && <Menu.Item><Label color={ethChainLabelColor}>{ethChainDisplayString}</Label></Menu.Item> }
    //

    const canSignIn : boolean = useAppSelector((state) =>
        // User can sign in only if has an enc seed in account state
        state.account.enc_seed !== null && state.account.name !== null)

    // const ethChainId = useAppSelector((state) => state.ethereum.chainId)
    // const ethChainDisplayString = ethChainId === 1 ? "Mainnet" : "Testnet " + ethChainId
    // const ethChainLabelColor = ethChainId === 1 ? 'blue' : 'orange'

    return (
        <Menu fixed='top' stackable primary="true" style={{opacity: '80%'}}>
                <MenuItem as='a' href="/" header>
                    <img style={{width:'3em'}} src='/cmail_logo_black_trans.svg'/>
                </MenuItem>
                <Popup content='Browse the public cmail users directory' trigger={
                    <MenuItem as={Link} to='/users' name='users' style={{color:'blue'}} content="Who's here?"/>
                } />
                <MenuMenu position='right'>
                    <Menu.Item><Label color='orange'>Kovan Testnet</Label></Menu.Item>
                    { !canSignIn && <Menu.Item header link as='a' href="/signup">Sign Up
	                    <Label style={{top:'1px', left:'69%', color:'white'}} size='tiny' color='red' floating>+100</Label>
                    </Menu.Item> }
                    { canSignIn &&
                    <Menu.Item header link as='a' href="/signin">Sign In
	                </Menu.Item> }
                </MenuMenu>
        </Menu>
    )
}

export default GuestMenu
