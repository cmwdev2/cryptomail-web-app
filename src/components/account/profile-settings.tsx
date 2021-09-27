// @ts-ignore
import React, {useState} from 'react'
import {
    Button,
    Checkbox,
    Divider,
    Form, FormGroup, FormInput,
    Header,
    Icon, ItemGroup, Message, Popup,
    TabPane
} from 'semantic-ui-react'
import {useEffect} from 'react'
import {OptionalAccount} from '../../common/types'
import {useAppDispatch} from '../../app/hooks'
import {
    PublicAccountInfo,
    WebResource,
    WebResourcesTypes
} from '../../proto/types/types_pb'
import {updateSettings} from '../../features/account/update-settings'
import {validateProfileUrlProtocol} from '../../features/account/validators'

interface ProfileSettingsProps {
    localAccount: OptionalAccount
}

function ProfileSettings(props: ProfileSettingsProps) {
    const dispatch = useAppDispatch()

    const [bio, setBio] = useState("")
    const [listAccount, setListAccount] = useState(true)
    const [company, setCompany] = useState("")
    const [position, setPosition] = useState("")
    const [location, setLocation] = useState("")
    const [twitter, setTwitter] = useState("")
    const [linkedin, setLinkedin]= useState("")
    const [website, setWebsite] = useState("")
    const [telegram, setTelegram] = useState("")
    const [fullName, setFullName] = useState("")

    const [largeProfileImageUrl, setLargeProfileImageUrl] = useState("")
    const [smallProfileImageUrl, setSmallProfileImageUrl] = useState("")

    function hasUnsavedChanges() : boolean {
        if (props.localAccount === null) {
            return false
        }

        const info = props.localAccount.getPublicAccountInfo()!
        if (bio !== info.getProfile()) {
            return true
        }
        if (fullName !== info.getFullName()) {
            return true
        }

        if (company !== info.getOrgName()) {
            return true
        }

        if (position !== info.getPosition()) {
            return true
        }

        if (location !== info.getLocation()) {
            return true
        }

        if (smallProfileImageUrl !== info.getSmallProfileImageUrl()) {
            return true
        }

        if (largeProfileImageUrl !== info.getProfileImageUrl()) {
            return true
        }

        const twitterUrl = getUrlByType(info, WebResourcesTypes.WEB_RESOURCES_TYPES_TWITTER)
        if (twitter !== twitterUrl) {
            return true
        }

        const websiteUrl = getUrlByType(info, WebResourcesTypes.WEB_RESOURCES_TYPES_WEBSITE)
        if (website !== websiteUrl) {
            return true
        }

        const telegramUrl = getUrlByType(info, WebResourcesTypes.WEB_RESOURCES_TYPES_TELEGRAM)
        if (telegram !== telegramUrl) {
            return true
        }

        const linkedinUrl = getUrlByType(info, WebResourcesTypes.WEB_RESOURCES_TYPES_LINKEDIN)
        if (linkedin !== linkedinUrl) {
            return true
        }

        const settings = props.localAccount.getSettings()!
        if (listAccount !== settings.getPublicListAccount()) {
            return true
        }

        return false
    }

    function getUrlByType(info: PublicAccountInfo, type: number) {
        for (const url of info.getProfileUrlsList()) {
            if (url.getWebResourceType() === type) {
                return url.getUrl()
            }
        }
        return ""
    }

    function onSaveChangesClicked() {
        if (props.localAccount === null) {
            return
        }

        const info = props.localAccount.getPublicAccountInfo()!

        info.setProfile(bio)
        info.setFullName(fullName)
        info.setOrgName(company)
        info.setPosition(position)
        info.setLocation(location)
        info.setProfileImageUrl(largeProfileImageUrl)
        info.setSmallProfileImageUrl(smallProfileImageUrl)

        const web_resources = new Array<WebResource>()

        if (twitter.length > 0) {
            const twitter_info = new WebResource()
            twitter_info.setWebResourceType(WebResourcesTypes.WEB_RESOURCES_TYPES_TWITTER)
            twitter_info.setName("Twitter")
            twitter_info.setUrl(twitter)
            web_resources.push(twitter_info)
        }

        if (website.length > 0) {
            const web_info = new WebResource()
            web_info.setName("Website")
            web_info.setWebResourceType(WebResourcesTypes.WEB_RESOURCES_TYPES_WEBSITE)
            web_info.setUrl(website)
            web_resources.push(web_info)
        }

        if (linkedin.length > 0) {
            const linkedin_info = new WebResource()
            linkedin_info.setName("LinkedIn")
            linkedin_info.setWebResourceType(WebResourcesTypes.WEB_RESOURCES_TYPES_LINKEDIN)
            linkedin_info.setUrl(linkedin)
            web_resources.push(linkedin_info)
        }

        if (telegram.length > 0) {
            const tgram_info = new WebResource()
            tgram_info.setWebResourceType(WebResourcesTypes.WEB_RESOURCES_TYPES_TELEGRAM)
            tgram_info.setName("Telegram")
            tgram_info.setUrl(telegram)
            web_resources.push(tgram_info)
        }

        info.setProfileUrlsList(web_resources)

        console.log("user requested account listing: " + listAccount)
        const settings = props.localAccount.getSettings()!
        settings.setPublicListAccount(listAccount)


        dispatch(updateSettings({
            account_info: info,
            settings: settings}))
    }

    useEffect(() => {
        if (props.localAccount === null) {
            return
        }

        console.log("payment settings main effect...")

        const info = props.localAccount.getPublicAccountInfo()!
        setBio(info.getProfile())
        setFullName((info.getFullName()))
        setCompany(info.getOrgName())
        setPosition(info.getPosition())
        setLocation(info.getLocation())
        setSmallProfileImageUrl(info.getSmallProfileImageUrl())
        setLargeProfileImageUrl(info.getProfileImageUrl())

        for (const url of info.getProfileUrlsList()) {
            switch (url.getWebResourceType()) {
                case WebResourcesTypes.WEB_RESOURCES_TYPES_TWITTER:
                    setTwitter(url.getUrl())
                    break
                case WebResourcesTypes.WEB_RESOURCES_TYPES_LINKEDIN:
                    setLinkedin(url.getUrl())
                    break
                case WebResourcesTypes.WEB_RESOURCES_TYPES_TELEGRAM:
                    setTelegram(url.getUrl())
                    break
                case WebResourcesTypes.WEB_RESOURCES_TYPES_WEBSITE:
                    setWebsite(url.getUrl())
                    break
            }
        }

        const settings = props.localAccount.getSettings()!
        setListAccount(settings.getPublicListAccount())

    }, [props.localAccount, dispatch])


    /*
    function validateProfileImagesUrlsInput() : boolean {
        if (!validateProfileUrlProtocol(largeProfileImageUrl)) {
            return false
        }
        return validateProfileUrlProtocol(smallProfileImageUrl)
    }*/

    return (<TabPane>
                <Header><Icon name='ethereum'/>Your Profile</Header>

        <div>Your account can be anonymous, or it can include information you like to share about yourself or your organization. What you share helps others decide if they want to send you a paid message on cmail.
        <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'2px'}} />}
               header="Anonymous or Personal?"
               content="Adding personal or professional information to your account enables others to verify who you are before sending you a paid message. Account information provides helpful context to messages you send to other users on cmail."/>
        </div>

        <Form error style={{marginTop:'16px'}}>
            <FormGroup fluid="true">
                <FormInput  width={8}
                             type='text'
                             placeholder='https://mywebsite.wtf/profile.jpg'
                             id='form-input-profile-image'
                             value = {largeProfileImageUrl}
                             key='profile-image'
                             label= 'Large Profile Image Url'
                             icon='picture'
                             iconPosition='left'
                             onChange={(e) => setLargeProfileImageUrl(e.target.value)}
                />
                <FormInput width={8}
                            type='text'
                            placeholder='https://mywebsite.wtf/small_profile.jpg'
                            id='small-profile'
                            value = {smallProfileImageUrl}
                            key='spi'
                            label= 'Small Profile Image Url'
                            icon="picture"
                            iconPosition="left"
                            onChange={(e) => setSmallProfileImageUrl(e.target.value)}
                />
            </FormGroup>
            {!validateProfileUrlProtocol(largeProfileImageUrl) &&
	            <Message error header='Bad large profile image url' content='Image must be available via https. e.g. https://mysite/myimage.jpg'/>
            }
            {!validateProfileUrlProtocol(smallProfileImageUrl) &&
	        <Message error header='Bad small profile image url' content='Image must be available via https. e.g. https://mysite/myimage.jpg'/>
            }
            <FormInput width={16}
                       autoFocus
                       type='text'
                       placeholder='About yourself or your organization'
                       id='form-input-bio'
                       value = {bio}
                       onChange={(e) => setBio(e.target.value)}
                       key='bio'
                       label='Bio'
                       icon="pencil"
                       color="blue"
                       iconPosition="left"/>
            <FormGroup fluid={true}>
                <FormInput width={8}
                            type='text'
                            placeholder='Your full name. e.g. John Doe'
                            id='form-input-full-name'
                            value = {fullName}
                            key='fn'
                            icon="user"
                            iconPosition="left"
                            label= 'Full Name'
                            onChange={(e) => setFullName(e.target.value)}
                />
                <FormInput width={8}
                            type='text'
                            placeholder='City / Region / Country'
                            id='form-input-lo'
                            value = {location}
                            key='location'
                            label= 'Location'
                            icon="globe"
                            iconPosition="left"
                            onChange={(e) => setLocation(e.target.value)}
                />
            </FormGroup>
            <FormGroup fluid="true">
                <FormInput width={8}
                            type='text'
                            placeholder='The Awesome Company'
                            id='form-input-co'
                            value = {company}
                            key='co'
                            icon="building"
                            iconPosition="left"
                            label= 'Company / Org'
                            onChange={(e) => setCompany(e.target.value)}
                />
                <FormInput width={8}
                            type='text'
                            placeholder='Chief Happiness Officer'
                            id='form-input-pos'
                            value = {position}
                            key='position'
                            label= 'Position'
                            icon="users"
                            iconPosition="left"
                            onChange={(e) => setPosition(e.target.value)}
                />
            </FormGroup>
            <FormGroup fluid="true">
                <FormInput width={8}
                            type='text'
                            placeholder='https://twitter.com/my_user_name'
                            id='form-input-tw'
                            value = {twitter}
                            key='twitter'
                            label= 'Twitter'
                            icon="twitter"
                            iconPosition="left"
                            onChange={(e) => setTwitter(e.target.value)}
                />
                <FormInput
                    width={8}
                    type='text'
                    placeholder='https://t.me/my_user_name'
                    id='form-input-tg'
                    value = {telegram}
                    key='tgram'
                    label= 'Telegram'
                    icon="telegram plane"
                    iconPosition="left"
                    onChange={(e) => setTelegram(e.target.value)}
                />
            </FormGroup>
            <FormGroup fluid="true">
                <FormInput  width={8}
                             type='text'
                             placeholder='https://mywebsite.wtf'
                             id='form-input-website'
                             value = {website}
                             key='web'
                             label= 'Website'
                             icon='home'
                             iconPosition='left'
                             onChange={(e) => setWebsite(e.target.value)}
                />
                <FormInput width={8}
                            type='text'
                            placeholder='https://linkedin.com/in/my_user_name'
                            id='form-input-li'
                            value = {linkedin}
                            key='linkedin'
                            label= 'LinkedIn'
                            icon="linkedin"
                            iconPosition="left"
                            onChange={(e) => setLinkedin(e.target.value)}
                />
            </FormGroup>
            <Divider/>
            <Checkbox checked={listAccount}
                      onChange={(e, data) => setListAccount(data.checked!)}
                      label='Make my account visible' />
            <Popup trigger={<Icon color='blue' name="help" size='small' style={{marginLeft:'2px'}} />}
                   header="Account Visibility"
                   content="When your account is visible, it is listed on cmail accounts directory and anyone can find your account name and the information you provide about it on this screen. When it is not visible, only people who have your account name can send you a message on cmail."/>

            { hasUnsavedChanges() && <ItemGroup>
                <Divider/>
                <Button onClick={(_) => onSaveChangesClicked()} color='blue'>Save Changes</Button>
            </ItemGroup>}
        </Form>
    </TabPane>)
}

export default ProfileSettings
