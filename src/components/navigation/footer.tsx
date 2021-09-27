// @ts-ignore
import React from 'react'
import {Container} from 'semantic-ui-react'

function Footer() {
    return (
        <Container style={{textAlign:'center', marginTop:'10px', paddingBottom:'10px'}} >
            <div style={{marginBottom:'10px'}}>
                &copy; 2021 cmail DAO ·{" "}
                <a href="/about">About</a>  ·{" "}
                <a href="/users">Directory</a>  ·{" "}
                <a href="/faq">FAQ</a>  ·{" "}
                <a target='_blank' rel='noreferrer nofollow' href='https://discord.gg/dzEhCHsyX5'>Community & Support</a>  ·{" "}
                <a target='_blank' rel='noreferrer nofollow' href='https://twitter.com/cmwdev2'>Twitter</a>  ·{" "}
                <a href="/terms">Terms & Privacy</a>
            </div>
            <div style={{fontSize:'smaller'}}>This work is licensed under a <a rel="noreferrer" target='_blank' href="https://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.</div>

        </Container>
    )
}

export default Footer
