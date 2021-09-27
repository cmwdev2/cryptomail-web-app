// @ts-ignore
import React from 'react'

import {Container, Header, List, Segment, SegmentGroup} from 'semantic-ui-react'
import {useEffect} from 'react'
import Footer from '../navigation/footer'

function About() {
    useEffect(() => {
        document.title = "CMAIL - About";
    }, [])
  return (
      <Container style={{ textAlign:'left', opacity: '90%', marginTop:'20px', paddingBottom:'36px'}}>
          <SegmentGroup>
              <Segment>
                  <Header>About cmail</Header>
              </Segment>
              <Segment>
                  <p>Cmail was born out of a lack of adequate solution for compensating people for their online attention.</p>
                  <p>Cmail is developed and maintained by the Cmail Dao, a global group of crypto software and product builders.</p>
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                  <Header>Cmail alpha is here!</Header>
              </Segment>
              <Segment>
                  <div>Cmail alpha is the first release of cmail. It is now available to anyone to join.</div>
                  <List bulleted>
                      <List.Item><a href='/signup'>Sign up</a> for free</List.Item>
                      <List.Item>Read the <a href='/faq'>FAQ</a></List.Item>
                      <List.Item>Browse <a href='/users'>publicly listed users</a></List.Item>
                  </List>
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                  <Header>Cmail Support and Community</Header>
              </Segment>
              <Segment>
                  <p>Got any questions or feedback about Cmail? Join the <a target='_blank' rel='noreferrer nofollow' href='https://discord.gg/dzEhCHsyX5'>cmail community on discord</a> to get them answered and to get involved.</p>
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

export default About
