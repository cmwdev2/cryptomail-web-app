// @ts-ignore
import React from 'react'
import {Button, Container, Grid, Header, Segment, Image, GridColumn} from 'semantic-ui-react'
import {useEffect} from 'react'
import {Redirect} from 'react-router'
import {OptionalAccount} from '../../common/types'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './welcome.css'
import Footer from '../navigation/footer'

interface WelcomePageProps {
    localAccount: OptionalAccount
}

function WelcomePage(props: WelcomePageProps) {

    useEffect(() => {
        document.title = "CMAIL - Welcome";
    }, [])

    const slickSettings = {
        autoplay: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }

    function isMobile() : boolean {
        return window.innerWidth <= 767
    }


    if (props.localAccount !== null) {
        return <Redirect to='/inbox'/>
    }

    return (
        <Container style={{width:'100%', background:'transparent'}}>
        <Container style={{opacity: '80%', width:'100%', background:'white'}}>
            {!isMobile() && <Slider {...slickSettings} className="slide">
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        🌎 Attention is the world's most valuable resource, yet you give yours for free to strangers
					        on the Internet on a daily basis...
				        </Header>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        📥&nbsp; Your inbox is a todo list created by other people and companies that want your
					        attention for free... Maybe this is why you hate email so much?
				        </Header>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        🤔 It doesn't have to be like this.<br/>Crypto-currencies enable us to take back ownership
					        of our attention by charging others who want it for it.
				        </Header>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        👋 Introducing cmail<br/>Cmail is like gmail with built-in crypto payments for actions...
				        </Header>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        Cmail empowers you to get paid in cryptocurrency for your attention.
				        </Header>
				        <p>
					        You set your price for actions such as reading a message or replying to a message based on
					        how much you value your time.
				        </p>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        People and companies propose to pay you to read a message, reply to a message, have a
					        15-minutes zoom meeting, or watch a 5-minutes video.
				        </Header>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        Cmail empowers you to control how you spend your attention.
				        </Header>
				        <p>You choose what to read, when to read, who to reply to and what requested actions you are
					        willing to do.</p>
				        <p>You get paid in crypto-currency for doing so.
				        </p>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        Is cmail for you?
				        </Header>
				        <p>Consider using cmail if you and others value your time, and you would like to get paid for
					        spending your valuable time on other people and companies todo items.</p>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        Cut through the noise.
				        </Header>
				        <p>Consider using cmail if you want to reach specific people or companies with proposals for
					        products or services that they would have never otherwise read nor respond to.</p>
				        <p>Consider using cmail if you need information or opinion form specific people or companies
					        that you will never otherwise get.</p>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        📢 Announcing cmail alpha!
				        </Header>
				        <p>Cmail alpha release, an early release of the cmail service is now available for free to
					        anyone on desktop and mobile.</p>
				        <Button color='green' onClick={(_) => window.location.href = '/signup'}>
					        Join Now
				        </Button>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        🍻 Cmail alpha is free as in free beer.
				        </Header>
				        <p>Cmail alpha is now free to use for anyone.</p>
				        <p>Cmail makes money by taking a small percentage fee out of every crypto-currency payment
					        transaction executed on the platform.</p>
				        <Button color='green' onClick={(_) => window.location.href = '/faq'}>
					        Learn more...
				        </Button>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        🏴‍☠️ Cmail alpha is free as in freedom.
				        </Header>
				        <p>Cmail empowers you to control how you spend your valuable time.</p>
				        <p>Controlling your time is essential to be free.</p>
				        <p>Email has enslaved you, cmail will free you.</p>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        🔐 Privacy and security first.
				        </Header>
				        <p>Messages sent orn cmail are end-to-end encrypted using strong encryption and can only be read
					        by sender and receiver.
					        Cmail servers only store public accounts information and do not log any users activity.</p>
				        <Button color='green' onClick={(_) => window.location.href = '/faq'}>
					        Learn more...
				        </Button>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        👻 Personal or anonymous?
				        </Header>
				        <p>You can be as anonymous or personal as you want on cmail.</p>
				        <p>Being personal makes it more likely that other users will pay for your attention based on who
					        you are and your work position.</p>
				        <p>If you plan to mainly use cmail to pay other users for their attention then your camil
					        account can be fully anonymous.</p>
				        <Button color='green' onClick={(_) => window.location.href = '/faq'}>
					        Learn more...
				        </Button>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        👩🏽‍💻 Who created cmail?
				        </Header>
				        <p>Cmail was created and is maintained by the cmail DAO.</p>
				        <p>An anonymous collective of software designers from around the world who share a common vision
					        for building innovative crypto software that put users first.</p>
				        <p>Any profits generated by cmail after paying for hosting costs are distributed between the DAO
					        members.</p>
				        <Button color='green' onClick={(_) => window.location.href = '/faq'}>
					        Learn more...
				        </Button>
			        </Container>
		        </Segment>
		        <Segment inverted vertical textAlign="center">
			        <Container text className="active">
				        <Header inverted as="h1">
					        💻 ️Is cmail open source?
				        </Header>
				        <p>Cmail web app is open source software and is available for non-commercial use such as
					        security audits and educational purposes.</p>
				        <p>Cmail server software is not open source quite yet but we intend to open source it for the
					        beta release milestone.</p>
				        <Button color='green' onClick={(_) => window.location.href = '/faq'}>
					        Learn more...
				        </Button>
			        </Container>
		        </Segment>
	        </Slider>
            }
            <Container>
                <Segment vertical>
                    <Grid container stackable textAlign="center" columns={3}>
                        <GridColumn>
                            <Image centered circular size='small' src='cmail_alpha_logo.png'/>
                            <Header as="h1">Cmail Alpha is Here</Header>
                            <p>
                                Cmail alpha is available for free. Please use Chrome, Firefox or Brave web browsers with the metamask browser extension on a desktop or laptop computer.
                            </p>
                            <Button basic onClick={(_) => window.location.href='/signup'}>Sign Up &raquo;</Button>
                        </GridColumn>
                        <GridColumn>
                            <Image centered circular size="small" src="in_depth_promo.png"/>
                            <Header as="h1">Cmail in Depth</Header>
                            <p>
                                Read our FAQ to learn all about....
                            </p>
                            <Button basic onClick={(_) => window.location.href='/faq'}>View details &raquo;</Button>
                        </GridColumn>
                        <GridColumn>
                            <Image
                                centered
                                circular
                                size="small"
                                src="community.png"
                            />
                            <Header as="h1">Get Involved</Header>
                            <p>
                                Cmail is developed by the cmail DAO - come <a target='_blank' rel='noreferrer nofollow' href='https://discord.gg/dzEhCHsyX5'>hang out with us on discord</a>
                            </p>
                            <Button basic onClick={(_) => window.location.href='https://discord.gg/dzEhCHsyX5'}>Join Community &raquo;</Button>
                        </GridColumn>
                    </Grid>
                </Segment>
                <Segment vertical>
                    <Grid stackable>
                        <GridColumn width={10}>
                            <Header as="h1">
                                Introducing the {" "} <span className="sub">Cmail Token</span>
                            </Header>
                            <p>Cmail token is an ERC-20 token issued over the Ethereum blockchain. Cmail token is a governance token that gives control to cmail users over the evolution of the cmail product and has no monetary value. You earn cmail tokens just by using cmail alpha. New features and changes in existing features are determined by token holders votes on proposals. For additional information check our <a target='_blank' rel='noreferrer nofollow' href='https://discord.gg/dzEhCHsyX5'>discord community server</a>.
                            </p>
                            <Button basic onClick={(_) => window.location.href='/faq'}>Learn More &raquo;</Button>
                        </GridColumn>
                        <Grid.Column width={6}>
                            <Image src='admin_profile_large.jpg' />
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment vertical>
                    <Grid stackable>
                        <GridColumn width={6}>
                            <Image src='admin_profile_large.jpg' />
                        </GridColumn>
                        <GridColumn width={10}>
                            <Header as="h1">
                                Calling all{" "}
                                <span className="sub">NFT artists</span>
                            </Header>
                            <p>
                                Cmail give you an opportunity to promote your NFT visual art. Cmail alpha web app background is a preview of an NFT art piece and it include attribution and a link to your NFT sales web site. Please reach out to us if you'd like to have your NFT promoted on cmail.
                            </p>
                        </GridColumn>
                    </Grid>
                </Segment>
                <Segment vertical>
                    <Grid stackable>
                        <GridColumn width={10}>
                            <Header as="h1">
                                Join the <span className="sub">community</span>
                            </Header>
                            <p>
                                Join the cmail community and be part of figuring out together a better email service for all of us.
                            </p>
                            <Button basic onClick={(_) => window.location.href='https://discord.gg/dzEhCHsyX5'}>Cmail Community &raquo;</Button>

                        </GridColumn>
                        <GridColumn width={6}>
                            <Image src='admin_profile_large.jpg' />
                        </GridColumn>
                    </Grid>
                </Segment>
                <Footer/>
            </Container>
        </Container>
            <div style={{height:'40px'}}/>
        </Container>
    )
}

export default WelcomePage
