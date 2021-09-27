// @ts-ignore
import React from 'react'

import {Accordion, Container, Header, Segment, SegmentGroup} from 'semantic-ui-react'
import {useEffect} from 'react'
import Footer from '../navigation/footer'

const generalFaqPanels = [
    {
        key: 'what-is-cmail',
        title: 'What is a cmail?',
        content: [
            'Cmail is a new messaging service with built in crypto payments. You can think about it like gmail but with crypto payments at its core.',
        ].join(' '),
    },
    {
        key: 'use',
        title: 'Should I use it?',
        content: {
            content: [
                'Cmail is designed for people who value their time and who would like to be compensated by others who want their attention. If you are such a person then cmail may be for you.'
            ].join(' ')
        },
    },
    {
        key: 'creators',
        title: 'Who created it?',
        content: [
            'Cmail was created by the Cmail DAO. A global group of crypto software designers.',
        ].join(' '),
    },
    {
        key: 'why',
        title: 'Why was this created?',
        content: [
            'Lack of an existing product for compensating people for their online attention.',
        ].join(' '),
    },
    {
        key: 'gmail',
        title: 'How is cmail different than gmail?',
        content: {
            content:
                (<div>
                    <p>Cmail is quite different from gmail in several important ways</p>
                    <ul>
                        <li>Cmail has strong built-in crypto-payments features so people who want to message you must pay your attention prices. Think about cmail as your premium inbox.</li>
                        <li>Cmail is much more private. It doesn't have access to your message's content - it is end-to-end encrypted between you and the receiver.</li>
                        <li>Cmail sever don't store or have access to your account password. Therefore cmail can't misuse your account, and hackers can't steal your password from the cmail server.</li>
                        <li>Cmail doesn't have any ads. The people who use cmail are its real users and not advertisers.</li>
                        <li>Cmail allows your account to be completely anonymous, and it is totally up to you how much personal information to include in it.</li>
                        <li>Cmail is built by a group of developers under the cmail dao and not by one company.</li>
                        <li>Cmail web application is open-source so security researchers can easily verify cmail security and privacy features.</li>
                        <li>Cmail is built by a group of developers under the cmail dao and not by one company.</li>
                        <li>Cmail users have control over which new features will be added to cmail by voting on proposals with their cmail tokens. Cmail tokens are granted for simply using cmail. This ensures that in cmail users will always be first.</li>
                    </ul>
                </div>)
        },
    },
]

const cmailTokenPanels = [
    {
        key: 'cmail-token',
        title: 'What is cmail token?',
        content: [
            'Cmail token ($CMAIL) is a governance token issued on the Ethereum blockchain. It is designed to give cmail product users power product\'s features and roadmap decisions, and has no monetary value.',
        ].join(' '),
    },
    {
        key: 'get-tokens',
        title: 'How do I get tokens?',
        content: {
            content:
                (<div>
                    <p>You simply use cmail alpha! Actions you perform in the app grants you with tokens on a monthly basis. These tokens are air dropped to the Ethereum wallet address you use with cmail every month.</p>
                    <p>There is currently the only way to get cmail tokens.</p>
                        <p>The following list details the amount of tokens you get for using different cmail features:</p>
                    <ul>
                        <li>Sign up to cmail alpha - 100 tokens</li>
                        <li>Send a paid message to another user - 100 tokens</li>
                        <li>Open a pay to open message sent by another user to you - 100 tokens</li>
                        <li>Reply to a pay to reply message sent by another user to you - 100 tokens</li>
                    </ul>
                        <p>Additional paid features are currently under development.</p>
                </div>
                ),
        },
    },
    {
        key: 'use-tokens',
        title: 'How do I use my tokens?',
        content: {
            content: (
                <p>You can make proposal for changing cmail alpha features, propose new cmail alpha features (such as supporting other kinds of tokens for payments), and vote on
                    proposals created by others and the cmail DAO. Cmail product development process is going to be guided by these proposals.<a target='_blank' rel='noreferrer nofollow' href='https://discord.gg/dzEhCHsyX5'>Join
                        our discord sever</a> for additional information.</p>
            ),
        },
    },
    {
        key: 'motivation',
        title: 'Why did you create it?',
        content: [
            'We created cmail token to give users ownership of cmail. Unlike legacy centralized products were the product builders may or may not consider the users in making core product decisions, in cmail, we wanted to make sure that the user is always first and cmail token is the means to achieve this project goal.'
        ].join(' '),
    },
]

const alphaFaqPanels = [
    {
        key: 'what-is-cmail-alpha',
        title: 'What is cmail alpha?',
        content: [
            'Cmail alpha is the first cmail product release. It is an early version of the cmail software service with a basic set of features.',
            'It is called alpha because it is pre-production ready experimental software.'
        ].join(' '),
    },
    {
        key: 'what',
        title: 'What is cmail alpha good for?',
        content: [
            'You set up a price for reading a message and a price for replying to a message. Other people send you paid messages, and you get paid for reading them or for replying for them.',
            'You can also send paid to open and paid to reply messages to any other cmail user.',
        ].join(' ')
    },
    {
        key: 'veriy',
        title: 'How can I verify the identity of a cmail account?',
        content: [
            'Cmail alpha account names are unique and permanent. When a user wants to identify itself, it share their cmail account name on any medium such as verified social media accounts.',
        ].join(' ')
    },
    {
        key: 'price',
        title: 'How much does it cost?',
        content: [
            'Cmail alpha is free to use and there are no ads on it. Cmail charges a small percentage fee of 5% on every cmail payments related transaction.',
            'This fee is designed to cover cmail development and maintenance costs.',
        ].join(' '),
    },
    {
        key: 'use-cmail-alpha',
        title: 'How do I get started?',
        content: {
            content: (
                <ul>
                    <li>You sign-up to cmail from your web browser. You need to use Chrome, Firefox or Brave web
                        browser, and the Metamask browser extension on a mobile or desktop computer.
                    </li>
                    <li>You get a unique account name and a permanent url that you share with people you want to start
                        receiving paid messages from.
                    </li>
                    <li>New messages appear in your inbox just like in email. From there you can read them, reply to
                        them and collect payments.
                    </li>
                </ul>)
        }
    },
    {
        key: 'form-payments',
        title: 'What form of payments are supported?',
        content: [
            'Cmail alpha supports payment in the Ethereum crypto-currency.',
            'Additional forms of payments such as stable coins, tokens and other crypto-currencies are in development and will be added in future updates.',
        ].join(' '),
    },
    {
        key: 'kind-payments',
        title: 'What kind of payments are supported?',
        content: [
            'Cmail alpha supports payments for reading a message and for replying to a message. Message authors decide which of the tow payment forms to use in their messages.',
            'Additional payment actions, such as payment to watch a 5-minutes video or to have a 10-minutes zoom conference, are in development and will be added in the future.',
        ].join(' '),
    },
    {
        key: 'biz-model',
        title: 'How does cmail alpha make money?',
        content: [
            'Cmail makes money to cover the service development and maintenance costs by taking a small transaction fee of 5% on cmail payment related transactions so it only makes money if it delivers value to its user-base.',
        ].join(' '),
    },
    {
        key: 'private',
        title: 'Is cmail alpha private?',
        content: {
            content: (
                <div>
                    <p>Cmail alpha is build with strong privacy in mind and it provides strong privacy features.</p>
                    <ul>
                        <li>The content of the messages you sent on cmail are end-to-end encrypted and can't be read by any party besides the message's author and designated receiver.</li>
                        <li>Cmail servers also doesn't have access to, and doesn't store your account password or keys.</li>
                        <li>Cmail alpha doesn't store any unencrypted user media file such as profile images.</li>
                        <li>Cmail alpha doesn\'t log the network identifiable information of users requests to any of its servers.</li>
                        <li>Cmail alpha web application does use any cookies, and only uses Google Analytics for aggregated site performance purposes. If you are uncomfortable with Google Analytics being used in cmail alpha, you can just block it in your browser using your ad blocker.</li>
                        <li>Cmail alpha only stores users account information that users explicitly chose to add to their public cmail profile.</li>
                        <li>Messages are deleted from cmail servers after a period of 3 months.</li>
                        <li>All server logs are deleted after a period of 1 month.</li>
                    </ul>
                    <p>The complete cmail alpha privacy policy is available here.</p>
                </div>
            ),
        }
    },
    {
        key: 'profile',
        title: 'What information is shared publicly on cmail alpha?',
        content: {
            content: (
                <div>
                    <p>You choose exactly what information to share in your cmail account so you can be as anonymous or as personal you want on cmail.</p>
                    <ul>
                        <li>You choose exactly what information to share in your cmail account so you can be as anonymous or as personal you want on cmail.</li>
                        <li>The minimum information that you share in cmail is your account name which is globally unique, and your read a message and reply to a message prices. All other account information is fully optional.</li>
                        <li>All profile information is public.</li>
                        <li>You decide if your profile should be publicly listed in the cmail users directory.</li>
                        <li>If your profile is listed then anyone can find your cmail account and send you messages.</li>
                        <li>If your profile is unlisted then only people who know your unique account name can find you on cmail and send you messages.</li>
                    </ul>
                </div>)
        }
    },
    {
        key: 'secure',
        title: 'Is cmail alpha secure?',
        content: {
            content: (
                <div>
                    <p>Cmail alpha includes strong security features.</p>
                    <ul>
                        <li>All communications between the cmail alpha web app running in your web browser and cmail servers is encrypted.</li>
                        <li>All messages content is end-to-end encrypted using strong encryption (ED25119) and can only be decrypted by the message's send and receiver.</li>
                        <li>Your cmail account password is not stored on cmail servers and not in your browser local storage.</li>
                        <li>Your cmail account encryption keys are stored encrypted with your password in your local browser storage and are only available to you when you use cmail.</li>
                        <li>Your account is protected by secret secret words. It is not possible to access your account on any device without knowledge of these words.</li>
                        <li>When you sign-out of your cmail account, no unencrypted information is available in your browser storage and you can only sign-in to it again using your cmail account password.</li>
                    </ul>
                    <p>Warning: cmail alpha is a pre-production software which was not security audited yet and may have security issues. Use it at your own risk.</p>
                </div>)
        }
    },
    {
        key: 'devices',
        title: 'Does it work on my device?',
        content: [
            'To use camil alpha, you need to use Chrome, Firefox or Brave web browsers on a desktop or laptop computer with the Metamask browser extension.',
            'Cmail alpha is not available on mobile devices yet.',
        ].join(' '),
    },
    {
        key: 'decentralized',
        title: 'Is cmail alpha decentralized?',
        content: [
            'Cmail alpha is using blockchain and cryptocurrencies but it is not a 100% decentralized platform.',
            'Cmail alpha uses centralized servers to provide the service to users. Future releases with decentralized servers is in development.',
        ].join(' '),
    },
    {
        key: 'open-source',
        title: 'Is cmail alpha open source?',
        content: {
            content: (
                <div>
                    <p>Some components of cmail alpha are open source software:</p>
                    <ul>
                        <li>Cmail alpha web application is open source and is <a rel='noreferrer' target='_blank' href='https://github.com/cmwdev2/cryptomail-web-app'>available here</a>.</li>
                        <li>Cmail alpha api is open source and will be available soon.</li>
                        <li>Cmail alpha smart contracts are open source will be available soon.</li>
                    </ul>
                    <p>Cmail alpha server software is not open source yet but may become open source in the future.</p>
                    <p>Note that cmail open source software is not free software because it is only available for non-commercial use such as educational and security audits and not for commercial use.</p>
                </div>
            )
        }
    },
    {
        key: 'support',
        title: 'How do I get support?',
        content: [
            'Join the cmail community discord server here, the cmail Telegram community here, or send a direct message to team cmail Twitter account.',
        ].join(' '),
    },
    {
        key: 'terms',
        title: 'What are the terms of use?',
        content: [
            'cmail alpha terms of use are available here.',
        ].join(' '),
    },
    {
        key: 'can-r',
        title: 'Can I get refund for a payment?',
        content: [
            'Yes! If you pay someone on cmail to read or reply to your message and they don\'t withdraw your payment then you can get refunded for the payment amount minus a 5% cmail transaction fees.',
            'Click the refund button to execute a refund smart contract transaction via Metamask. Your Etherum account will be refunded by your payment mount minus a 5% cmail transaction fee.'
        ].join(' '),
    },
    {
        key: 'how-r',
        title: 'How do I get a refund?',
        content: [
            'Browse the messages in your sent items box. A refund button is displayed in paid messages you sent if the payment wasn\'t withdrawn by the receiver in over a month from the time you have made the payment.',
        ].join(' '),
    },
    {
        key: 'art',
        title: 'Can I include my art in cmail alpha?',
        content: [
            'Cmail alpha background images are NFT art pieces provided by artists who want to promote their work to cmail users.',
            'Cmail alpha also include account profile images which are NFT art pieces.',
            'Reach out to us on the cmail discord server if you are an artist and would like to have your NFT art promoted on camil.',
        ].join(' '),
    },
]

function Faq() {
    useEffect(() => {
        document.title = "CMAIL - FAQ";
    }, [])
  return (
      <Container style={{ textAlign:'left', opacity: '90%', marginTop:'20px', paddingBottom:'36px'}}>
          <SegmentGroup>
              <Segment>
                  <Header>General FAQ</Header>
              </Segment>
              <Segment>
                  <Accordion fluid styled defaultActiveIndex={0} panels={generalFaqPanels} />
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                  <Header>Cmail Alpha FAQ</Header>
              </Segment>
              <Segment>
                  <Accordion fluid styled defaultActiveIndex={0} panels={alphaFaqPanels} />
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                  <Header>Cmail Token FAQ</Header>
              </Segment>
              <Segment>
                  <Accordion fluid styled defaultActiveIndex={0} panels={cmailTokenPanels} />
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                 <Footer/>
              </Segment>
          </SegmentGroup>
      </Container>
      )
}

export default Faq
