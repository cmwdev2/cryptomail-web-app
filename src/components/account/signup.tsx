// @ts-ignore
import React from 'react'
import { useEffect, useState} from 'react'
import { useAppDispatch } from '../../app/hooks'
import {
    Container,
    Message,
} from 'semantic-ui-react'
import {useAppSelector} from '../../app/hooks'
import {ethers} from 'ethers'
import {updateSignature} from '../../features/ethereum/ethereum-slice'
import {OptionalAppError, setLastError} from '../../features/app/app-slice'
import {grpc} from '@improbable-eng/grpc-web'

import {
    checkAccountNameAvailability
} from '../../features/public-accounts/public-accounts-server-api'
import {GetAccountRequest} from '../../proto/api/api_types_pb'

import {Settings} from '../../proto/types/accounts_pb'
import {
    Amount,
    Token,
    PublicAccountInfo,
    WebResource,
    WebResourcesTypes,
    PaymentSettings, PaidAction, PaidActionType, EthAddress
} from '../../proto/types/types_pb'
import {utils} from 'aes-js'
import {SignupParams, signup} from '../../features/account/signup'
import { useHistory } from 'react-router-dom'
import CryptoUtils from '../../features/crypo/crypto'
import {Redirect} from 'react-router'
import {OptionalNameAvailable, setNameAvailability} from '../../features/public-accounts/public-accounts-slice'
import UserInfoModal from './user-info-modal'
import SummaryModal from './summary-modal'
import UserInputModal from './user-input-modal'
import {max_account_name_chars} from '../../common/config'
import ProfileMediaModal from './profile-media-modal'
import {signMessage} from '../../features/ethereum/ethereum-thunks'
import {validateProfileUrlProtocol} from '../../features/account/validators'

interface SignUpProps {
    interactiveMetamaskConnect: () => void
}

function SignUp(props: SignUpProps) {

    const dispatch = useAppDispatch()
    const history = useHistory()

    useEffect(() => {
        document.title = "CMAIL - Sign Up";

        const baseUrl = window.location.protocol + '//' + window.location.host
        setSmallProfileImageUrl(baseUrl + '/avatar_small.png')
        setLargeProfileImageUrl(baseUrl + '/avatar_large.png')

    }, [])

    // Ethereum state
    // const ethChainId = useAppSelector((state) => state.ethereum.chainId)
    const ethAccount = useAppSelector((state) => state.ethereum.account)
    const ethSignature = useAppSelector((state) => state.ethereum.signature)
    const displayMetamaskConnect = useAppSelector((state) => state.ethereum.account === null)
    const metaMaskAvailable = (typeof window.ethereum !== 'undefined')

    // local state
    const [accountNameInput, setAccountNameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [priceOpenInput, setPriceOpenInput] = useState("0.0001")
    const [priceReplyInput, setPriceReplyInput] = useState("0.0002")

    // account name and pricing
    const [stepOneModalOpen, setStepOneModalOpen] = useState(true)

    // profile info
    const [stepTwoModalOpen, setStepTwoModalOpen] = useState(false)
    const [stepTwoCompleted, setStepTwoCompleted] = useState(false)

    // profile media (image, etc...)
    // const [stepThreeModalOpen, setStepThreeModalOpen] = useState(false)
    const [stepThreeCompleted, setStepThreeCompleted] = useState(false)

    // summary page
    // const [stepFourModalOpen, setStepFourModalOpen] = useState(false)
    // const [stepForCompleted, setStepFourCompleted] = useState(false)

    const [signUpInProgress, setSignUpInProgress] = useState(false)

    // optional account public info
    const [bio, setBio] = useState("")
    const [publicAccountInput, setPublicAccountInput] = useState(true)
    const [company, setCompany] = useState("")
    const [position, setPosition] = useState("")
    const [location, setLocation] = useState("")
    const [twitter, setTwitter] = useState("")
    const [linkedin, setLinkedin]= useState("")
    const [website, setWebsite] = useState("")
    const [tgram, setTgram] = useState("")

    const [fullName, setFullName] = useState("")

    const [largeProfileImageUrl, setLargeProfileImageUrl] = useState("")
    const [smallProfileImageUrl, setSmallProfileImageUrl] = useState("")

    const accountAvailability: OptionalNameAvailable = useAppSelector((state) => state.pub_accounts.name_availability)
    const [accountAvailabilityCheckInProgress, setAccountAvailabilityCheckInProgress] = useState(false)

    const serverError : OptionalAppError = useAppSelector((state) => state.app.last_error)

    // new account mnemonic
    const mnemonic : string = useAppSelector((state) => {
        if (state.account.seed === null) {
            return ""
        }
        return CryptoUtils.seedToMnemonic(state.account.seed as string)
    })

    const hasLastError: boolean = useAppSelector((state) => state.app.last_error !== null)
    const isSignedIn : boolean = useAppSelector((state) =>
        // User is signed-in only when we have encrypted seed and account name
        state.account.seed != null &&
        state.account.key_pair != null &&
        state.account.account != null &&
        state.account.name != null
    )

    function openStepOneModal() {
        setSignUpInProgress(false)

        setStepOneModalOpen(true)
        setStepTwoModalOpen(false)
        // setStepThreeModalOpen(false)
        // setStepFourModalOpen(false)

    }

    function openStepTwoModal() {

        setStepTwoCompleted(false)
        setStepThreeCompleted(false)

        setStepOneModalOpen(false)
        setStepTwoModalOpen(true)
        // setStepThreeModalOpen(false)
        // setStepFourModalOpen(false)

    }

    // Profile image
    function openStepThreeModal() {
        console.log('opening profile')

        setStepThreeCompleted(false)
        setStepTwoCompleted(true)

        // setStepThreeModalOpen(true)

        setSignUpInProgress(false)
        setStepOneModalOpen(false)
        setStepTwoModalOpen(false)
        // setStepFourModalOpen(false)
    }

    // Summary view
    /*
    function openStepFourModal() {
        console.log('closing step 1 and 2')

        setSignUpInProgress(false)

        setStepOneModalOpen(false)
        setStepTwoModalOpen(false)

        // setStepThreeModalOpen(false)
    }*/

    function onStepTwoNextClicked() {
        openStepThreeModal()
    }

    function getProfileImageInputErrorComponent(): any {
        const allowHttp = window.location.protocol === "http:"
        if (allowHttp) {
            if (largeProfileImageUrl !== "" && !largeProfileImageUrl.startsWith("http://") &&
                !largeProfileImageUrl.startsWith("https://")) {
                return <Message error header='Bad url'
                    content='Large profile image url must be an http or an https url.'/>
            }
            if (smallProfileImageUrl !== "" && !smallProfileImageUrl.startsWith("http://") &&
                !smallProfileImageUrl.startsWith("https://")) {
                return <Message error header="Bad url"
                                content='Small profile image url must be an http or an https url.'/>
            }
        } else {
            if (largeProfileImageUrl !== "" && !largeProfileImageUrl.startsWith("https://")) {
                return <Message error header="Bad url"
                                content='Large profile image url must be empty or an https url. e.g. https://site/profile_image.gif'/>
            }
            if (smallProfileImageUrl !== "" && !smallProfileImageUrl.startsWith("https://")) {
                return <Message error header="Bad url"
                                content='Small profile image url must be empty or an https url. e.g. https://site/profile_image.gif'/>

            }
        }

        // todo: check for .jpeg, .jpg, .png or .gif url suffices

        return null
    }

    function validateProfileImagesUrlsInput() : boolean {
        if (!validateProfileUrlProtocol(largeProfileImageUrl)) {
            return false
        }
        return validateProfileUrlProtocol(smallProfileImageUrl)
    }

    function onStepThreeNextClicked() {
        if (!validateProfileImagesUrlsInput()) {
            console.log("profile image input invalid")
            return
        }
        signupUser()
    }

    // Signup the user
    function signupUser() {

        const message = validateStepOneInput()

        if (message !== "") {
            console.log("Validation failed. Can't sign in")
            dispatch(setLastError({
                message: 'Cannot Sign Up',
                reason: message,
                code: grpc.Code.InvalidArgument
            }))
            return
        }

        // todo: validate ALL step 3 input such as bio...
        setSignUpInProgress(true)
        setStepThreeCompleted(true)

        const settings = new Settings()
        settings.setPublicListAccount(publicAccountInput)
        settings.setActive(true)
        settings.setDisplayArtBackground(true)

        const payment_settings = new PaymentSettings()
        const pay_to_open = new PaidAction()
        const amount_open = new Amount()
        amount_open.setToken(Token.TOKEN_ETH)

        const priceOpen = ethers.utils.parseEther(priceOpenInput)
        console.log("user open price wei: " + priceOpen.toString())
        amount_open.setAmount(priceOpen.toString())
        pay_to_open.setPrice(amount_open)
        pay_to_open.setPaidActionType(PaidActionType.PAID_ACTION_TYPE_OPEN)

        const pay_to_reply = new PaidAction()
        const amount_reply = new Amount()
        amount_reply.setToken(Token.TOKEN_ETH)

        const priceReply = ethers.utils.parseEther(priceReplyInput)
        console.log("user reply price wei: " + priceReply.toString())
        amount_reply.setAmount(priceReply.toString())
        pay_to_reply.setPrice(amount_reply)
        pay_to_reply.setPaidActionType(PaidActionType.PAID_ACTION_TYPE_REPLY)

        payment_settings.setPaidActionsList([pay_to_open, pay_to_reply])

        const address = new EthAddress()
        address.setBytes(Uint8Array.from(utils.hex.toBytes(ethAccount.substring(2))))
        payment_settings.setEthAddress(address)

        console.log("sign up eth signature: " + ethSignature)
        payment_settings.setEthSignature(Uint8Array.from(utils.hex.toBytes(ethSignature.substring(2))))

        const account_info = new PublicAccountInfo()
        account_info.setName(accountNameInput)
        account_info.setFullName(fullName)
        account_info.setOrgName(company)
        account_info.setPosition(position)
        account_info.setLocation(location)
        account_info.setProfile(bio)

        const baseUrl = window.location.protocol + '//' + window.location.host
        if (smallProfileImageUrl === "") {
            setSmallProfileImageUrl(baseUrl + '/avatar_small.jpg')
        }
        if (largeProfileImageUrl === "") {
            setLargeProfileImageUrl(baseUrl + '/avatar_large.jpg')
        }

        account_info.setProfileImageUrl(largeProfileImageUrl)
        account_info.setSmallProfileImageUrl(smallProfileImageUrl)
        account_info.setPaymentSettings(payment_settings)

        const web_resources = new Array<WebResource>()

        // todo: validate all user input
        if (twitter.length > 0) {
            const handle = (twitter.indexOf("@") === 0) ? twitter.substring(1) : twitter
            const twitter_info = new WebResource()
            twitter_info.setWebResourceType(WebResourcesTypes.WEB_RESOURCES_TYPES_TWITTER)
            twitter_info.setName("Twitter")
            const url = handle.startsWith("https://") ? handle : "https://twitter.com/" + handle
            twitter_info.setUrl(url)
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
            const handle = (linkedin.indexOf("@") === 0) ? linkedin.substring(1) : linkedin
            const linkedin_info = new WebResource()
            linkedin_info.setName("LinkedIn")
            linkedin_info.setWebResourceType(WebResourcesTypes.WEB_RESOURCES_TYPES_LINKEDIN)
            const url = handle.startsWith("https://") ? handle : "https://linkedin.com/in/" + handle
            linkedin_info.setUrl(url)
            web_resources.push(linkedin_info)
        }

        if (tgram.length > 0) {
            const handle = (tgram.indexOf("@") === 0) ? tgram.substring(1) : tgram
            const tgram_info = new WebResource()
            tgram_info.setWebResourceType(WebResourcesTypes.WEB_RESOURCES_TYPES_TELEGRAM)
            tgram_info.setName("Telegram")
            const url = handle.startsWith("https://") ? tgram : "https://t.me/" + handle
            tgram_info.setUrl(url)
            web_resources.push(tgram_info)
        }

        account_info.setProfileUrlsList(web_resources)

        const params : SignupParams = {
            settings: settings,
            account_info: account_info,
            password: passwordInput, // from ui
            keep_signed_in: true // for now - todo: get from a checkbox
        }

        dispatch(signup(params))
    }

    useEffect(() => {
        if (accountAvailabilityCheckInProgress && accountAvailability !== null) {
            console.log("name availability check complete...")
            setAccountAvailabilityCheckInProgress(false)
            if (accountNameInput === null || accountNameInput.length === 0) {
                return
            }
            if (accountAvailability.available) {
                openStepTwoModal()
            }
        }
    }, [accountAvailability, accountAvailabilityCheckInProgress, accountNameInput])

    function onStepOneNextClicked() {

        if (validateStepOneInput() !== "") {
            console.log("Step one input is invalid and needs to be corrected")
            return
        }

        dispatch(setNameAvailability(null))
        setAccountAvailabilityCheckInProgress(true)
        const request = new GetAccountRequest()
        request.setName(accountNameInput)
        dispatch(checkAccountNameAvailability(request))
    }

    async function signEthAddressClickHandler() {
        if (ethAccount === null || ethAccount.substring(0,2) !== "0x") {
            console.log("need valid eth account - please connect metamask")
            return
        }

        dispatch(signMessage({ethAccount: ethAccount, message: accountNameInput}))
    }

    function onAccountNameFocusOut() {

        dispatch(setNameAvailability(null))

        // remove eth signature because it was bound to previous account name
        dispatch(updateSignature(null))

    }

    function onAccountNameFocusIn() {
        // clear last error as user is editing the name
        dispatch(setLastError(null))
    }

    function getSignUpErrorMessageComponent() : any {
        if (serverError !== null) {

            console.log("Server error: " + serverError.message);
            console.log("Server error code: " + serverError.code);
            console.log("Server error reason: " + serverError.reason);

            if (serverError.code === grpc.Code.Internal) {
                return <Message
                    error
                    header="Cmail server error"
                    content="The cmail server has encountered an error. Please try again later."
                />
            }

            if (serverError.code === grpc.Code.AlreadyExists) {
                return <Message
                    error
                    header = 'Name taken'
                    content= 'There is already an account with this name. Please try a different name.'
                />
            }

            return <Message
                error
                header="Cmail server error"
                content="Can't access the cmail server. Please try again later."
            />
        }

        if (accountAvailability !== null && !accountAvailability.available && accountNameInput.length > 0) {
            return <Message
                error
                header = 'Name taken'
                content= 'There is already an account with this name. Please try a different name.'
            />
        }

        return null
    }

    function validateStepOneInput() : string {

        if (accountNameInput.length === 0) {
            return "Please enter a name for your account."
        }

        if (accountNameInput.length >= max_account_name_chars) {
            return "Please make your account name shorter. It must be less than 140 characters"
        }

        if (passwordInput.length === 0) {
            return "Please enter a password for your account."
        }

        if (ethAccount === null || ethAccount.length === 0) {
            return "Please select an Ethereum address to associate with your cmail account using Metamask."
        }

        if (ethSignature === null) {
            return "Please sign your Ethereum address with metamask to prove ownership."
        }

        const floatPriceOpenInput = parseFloat(priceOpenInput)
        if (floatPriceOpenInput === 0) {
            return "Please enter a price in eth for reading and opening a message received from other users."
        }

        const floatPriceReplyInput = parseFloat(priceReplyInput)
        if (floatPriceReplyInput !== 0) {
            const priceOpen = ethers.utils.parseEther(priceOpenInput)
            const priceReply = ethers.utils.parseEther(priceReplyInput)
            if (priceOpen.gte(priceReply)) {
                return "Your reply price must be bigger than your open price."
            }
        }

        return ""
    }

    function onDoneClicked() {
        history.push("/inbox")
    }

    return (
        <Container fluid={true} textAlign='left' style={{marginTop:'20px'}}>
            <UserInputModal
                shouldOpen={stepOneModalOpen}
                onOpenCallback={openStepOneModal}
                //onBackButtonClicked={}
                onNextButtonClicked={onStepOneNextClicked}
                hasLastError={hasLastError}
                signUpInProgress={signUpInProgress}
                getErrorMessageComponent={getSignUpErrorMessageComponent}
                password={passwordInput}
                onPasswordChanged={setPasswordInput}
                accountName={accountNameInput}
                onAccountNameChanged={setAccountNameInput}
                ethAccount={ethAccount}
                ethSignature={ethSignature}
                metaMaskAvailable={metaMaskAvailable}
                signEthAddressClickHandler={signEthAddressClickHandler}
                onConnectEthereumClicked={props.interactiveMetamaskConnect}
                displayMetamaskConnect = {displayMetamaskConnect}
                onSignedEthAddressClicked={signEthAddressClickHandler}

                priceOpen={priceOpenInput}
                setPriceOpen={setPriceOpenInput}
                priceReply={priceReplyInput}
                setPriceReply={setPriceReplyInput}

                onAccountNameFocusIn={onAccountNameFocusIn}
                onAccountNameFocusOut={onAccountNameFocusOut}
                validateStepOneInput={validateStepOneInput}
                accountAvailabilityCheckInProgress={accountAvailabilityCheckInProgress}
            />

            <UserInfoModal
                shouldOpen={stepTwoModalOpen}
                onBioChanged={setBio}
                bio={bio}
                onOpenCallback={openStepTwoModal}
                accountPublic={publicAccountInput}
                onAccountPublicChanged={setPublicAccountInput}
                onBackButtonClicked={openStepOneModal}
                onNextButtonClicked={onStepTwoNextClicked}
                hasLastError={hasLastError}
                signUpInProgress={signUpInProgress}
                company={company}
                fullName={fullName}
                location={location}
                onCompanyChanged={setCompany}
                onFullNameChanges={setFullName}
                onLocationChanged={setLocation}
                onPositionChanged={setPosition}
                onTelegramChanged={setTgram}
                onTwitterChanged={setTwitter}
                onWebsiteChanged={setWebsite}
                position={position}
                telegram={tgram}
                twitter={twitter}
                website={website}
                linkedin={linkedin}
                onLinkedinChanged={setLinkedin}
            />

            <ProfileMediaModal
                getInputErrorMessage={getProfileImageInputErrorComponent}
                getSignupErrorMessage={getSignUpErrorMessageComponent}
                validateInput={validateProfileImagesUrlsInput}
                shouldOpen={stepTwoCompleted}
                onOpenCallback={openStepThreeModal}
                onNextButtonClicked={onStepThreeNextClicked}
                hasLastError={false}
                onBackButtonClicked={openStepTwoModal}
                largeProfileImageUrl={largeProfileImageUrl}
                smallProfileImageUrl={smallProfileImageUrl}
                onLargeImageUrlInputTextChanged={setLargeProfileImageUrl}
                onSmallImageUrlInputTextChanged={setSmallProfileImageUrl}
            />

            <SummaryModal
                shouldOpen={isSignedIn && stepThreeCompleted}
                opneCallback={openStepThreeModal}
                accountName={accountNameInput}
                password={passwordInput}
                mnemonic={mnemonic}
                onDoneClicked={onDoneClicked}
            />

            { isSignedIn && !stepTwoCompleted && <Redirect to='/'/> }
        </Container>
    )
}

export default SignUp
