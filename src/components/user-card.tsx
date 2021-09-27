// @ts-ignore
import React, {useEffect, useState} from 'react'
import {
    Image,
    Card,
    Label,
    Icon, Popup, CardContent, CardHeader, CardMeta
} from 'semantic-ui-react'
import {PaidActionType, WebResource, WebResourcesTypes} from '../proto/types/types_pb'
import {short_format_eth_address} from '../common/time'
import DOMPurify from 'dompurify'
import {Account} from '../proto/types/accounts_pb'
import {OptionalAccountInfo} from '../common/types'
import {formatWeiAmount} from '../features/ethereum/utils'

interface UserCardProps {
    user: Account, // the thread this card displays with all messages and senders info authenticated and decrypted
    clickable: boolean
}

// User card displays user public info
function UserCard(props: UserCardProps) {

    const [name, setName] = useState("")
    const [fullName, setFullName] = useState("")
    const [org, setOrg] = useState("")
    const [position, setPosition] = useState("")
    const [profile, setProfile] = useState("")
    const [location, setLocation] = useState("")
    const [openPrice, setOpenPrice] = useState("0")
    const [replyPrice, setReplyPrice] = useState("0")
    const [ethAddress, setEthAddress] = useState("")
    const [ogRank, setOgRank] = useState(0)
    const [largeProfileImageUrl, setLargeProfileImageUrl] = useState("")
    const [smallProfileImageUrl, setSmallProfileImageUrl] = useState("")
    const [earnedTokens, setEarnedTokens] = useState(0)
    const [userInfo, setUserInfo] = useState(null as OptionalAccountInfo)

    useEffect(() => {
        if (props.user === null) {
            return
        }
        const info = props.user.getPublicAccountInfo()

        if (!info) {
            return
        }

        const payment_settings = info!.getPaymentSettings()

        if (!payment_settings) {
            return
        }

        setUserInfo(info)

        setEthAddress(short_format_eth_address(payment_settings.getEthAddress()!.getBytes_asU8()))

        const prices = payment_settings.getPaidActionsList()
        for (const price of prices) {
            if (price.getPaidActionType()! === PaidActionType.PAID_ACTION_TYPE_OPEN) {
                // console.log("To user open price: " + price.getPrice()!.getAmount())
                setOpenPrice(price.getPrice()!.getAmount())
            }
            if (price.getPaidActionType()! === PaidActionType.PAID_ACTION_TYPE_REPLY) {
                // console.log("To user open price: " + price.getPrice()!.getAmount())
                setReplyPrice(price.getPrice()!.getAmount())
            }
        }

        setName(DOMPurify.sanitize(info.getName()))
        setFullName(DOMPurify.sanitize(info.getFullName()))
        setProfile(DOMPurify.sanitize(info.getProfile()))
        setOrg(DOMPurify.sanitize(info.getOrgName()))
        setPosition(DOMPurify.sanitize(info.getPosition()))
        setLocation(DOMPurify.sanitize(info.getLocation()))

        setLargeProfileImageUrl(info.getProfileImageUrl())
        setSmallProfileImageUrl(info.getSmallProfileImageUrl())

        const reputation = props.user.getReputation()
        if (reputation === null) {
            console.error("missing user reputation")
            return
        }
        setOgRank(reputation!.getOgRank())
        setEarnedTokens(reputation!.getCmailTokenBalanceTotalEarned())

    },[props.user])

    function getPayToOpenPopupText() {
        return 'Pay ' + name + ' ' + formatWeiAmount(openPrice) + ' to open and read a message. You make a deposit for the open price to the cmail smart contract. ' +
            name + ' can withdraw it after reading your message. If they doesn\'t do so then you can refund the amount back.';
    }

    function getPayToReplyPopupText() {
        return 'Pay ' + name + ' ' + formatWeiAmount(replyPrice) + ' to read and reply a message from you. You make a deposit for the reply price to the cmail smart contract. ' +
            name + ' can withdraw it after replying to your message. If they doesn\'t do so you can refund the amount back.';
    }

    function getUserRankPopupText() {
        return 'This user is OG #' + ogRank + ' in the first 1,000 cmail OGs'
    }

    function cardClickHandler() {
        const profileUrl = window.location.protocol + '//' + window.location.host + "/u/" + name
        console.log(profileUrl)
        //history.push(profileUrl)
        window.location.href = profileUrl
    }

    function getSocialIcon(resource: WebResource) {
        switch (resource.getWebResourceType()) {
            case WebResourcesTypes.WEB_RESOURCES_TYPES_TWITTER:
                return <Icon color='blue' name='twitter'/>
            case WebResourcesTypes.WEB_RESOURCES_TYPES_LINKEDIN:
                return <Icon color='blue' name='linkedin'/>
            case WebResourcesTypes.WEB_RESOURCES_TYPES_TELEGRAM:
                return <Icon color='blue' name='telegram'/>
            case WebResourcesTypes.WEB_RESOURCES_TYPES_WEBSITE:
                return <Icon color='orange' name='globe'/>
            default:
                return <Icon name='fax'/>

        }
    }

    const cardProps = props.clickable ? {
        onClick:(_: any) => cardClickHandler()
    } : null

    return (
        <Card raised={true} {...cardProps} style={{textAlign:'left'}}>
            <Image
                style={{maxWidth:'290px', maxHeight:'290px', width:'100%', height:'100%', display:'flex'}}
                src={largeProfileImageUrl}
                wrapped ui={false}/>

            <Popup header="Cmail Tokens"
                   content="Total amount of cmail tokens earned by this account."
                   trigger={
                       <Label style={{display:'relative', left:'17px', top:'2px'}} size='tiny' color='red' floating>
                           🪙&nbsp;&nbsp;&nbsp;{earnedTokens}</Label>
                   }/>

            {ogRank < 10000 && <Popup header='OG Rank' content={getUserRankPopupText()} trigger={
                <Label color='purple' size='huge' corner
                       style={{display: 'flex', opacity: '80%', justifyContent: 'right', alignItems: 'flex-start'}}>
                    <span style={{marginTop: '8px', fontSize: 'small', marginRight: '8px'}}>
                        🎖 {ogRank.toString()}
                    </span>
                </Label>
                }/>
            }
            <CardContent>
                    <CardHeader style={{display:'flex', alignItems:'center'}}>
                        <Image style={{height:'28px', width:'28px', marginRight:'6px'}} circular={true} src={smallProfileImageUrl}/>
                        {name}
                    </CardHeader>
                    <CardMeta style={{color:'#666666', marginTop:'10px'}}>
                        { fullName.length > 0  && <span><Icon name='user' color='blue'/>{fullName} <br/></span>}
                        { org.length > 0  && <span><Icon name='building' color='brown'/>{org} <br/></span>}
                        { position.length > 0  && <span><Icon name='users' color='orange'/>{position} <br/></span>}
                        { location.length > 0  && <span><Icon name='map' color='violet'/>{location} <br/></span>}
                        <span><Icon name='ethereum' color='yellow'/>{DOMPurify.sanitize(ethAddress)}</span>
                    </CardMeta>
                    { profile.length > 0 && <Card.Description>{profile}</Card.Description> }
                </CardContent>
                <CardContent extra style={{justifyContent:'flex-start', gap:'5px', alignItems:'center', alignContent:'flex-start', display:'flex', flexWrap:'wrap'}}>
                    { userInfo !== null && userInfo!.getProfileUrlsList().map((r) =>
                            <Label key={r.getWebResourceType().toString()} basic style={{border:'0px', fontWeight:'400'}} size='small'>
                                {getSocialIcon(r)}
                                <span style={{cursor:'pointer', color:'#111111'}} onClick={(_)=> document.location.href = r.getUrl()}>{r.getName()}</span>
                            </Label>)
                    }
                </CardContent>
                <CardContent extra style={{justifyContent:'center',alignItems:'center', display:'flex', paddingLeft:'4px', flexWrap:'wrap'}}>
                    { openPrice !== "0" &&
                        <Popup header='Open Price' content={getPayToOpenPopupText()} trigger={
                            <Label size='small' color='green' tag>Open Price<Icon name="ethereum" style={{marginRight:'1px', marginLeft:'6px'}}/>{formatWeiAmount(openPrice)}</Label>
                        }/>
                    }
                    {replyPrice !== "0" && <Popup header='Reply Price' content={getPayToReplyPopupText()} trigger={
                        <Label style={{marginTop:'10px'}} size='small' color='orange' tag>Reply Price<Icon style={{marginRight:'1px', marginLeft:'6px'}} name="ethereum"/>{formatWeiAmount(replyPrice)}</Label>
                        }/>
                    }
                </CardContent>
            </Card>
    )
}

export default UserCard
