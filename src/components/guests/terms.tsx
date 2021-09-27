// @ts-ignore
import React from 'react'

import {Container, Header, List, ListItem, Segment, SegmentGroup} from 'semantic-ui-react'
import {useEffect} from 'react'
import Footer from '../navigation/footer'


function Terms() {
    useEffect(() => {
        document.title = "CMAIL - Terms and Privacy";
    }, [])
  return (
      <Container style={{ textAlign:'left', opacity: '90%', marginTop:'20px'}}>
          <SegmentGroup>
              <Segment>
                  <Header>Web Site Privacy Policy and Cookies Use</Header>
              </Segment>
              <Segment>
                  <List bulleted>
                      <ListItem>This web site doesn't use any cookies.</ListItem>
                      <ListItem>This web site doesn't log any visitors information.</ListItem>
                      <ListItem>This web site collects aggregated usage data via Google Analytics (Unless your ad blocker blocks Google Analytics).</ListItem>
                      <ListItem>The cmail server stores cmail users' public account information provided by users to cmail, and makes it publicly available for anyone. Only set cmail account information that you are comfortable with being publicly shared with anyone.</ListItem>
                      <ListItem>The cmail servers stores metadata about your messages, messages threads, inbox, sent items and archive thread boxes. This metadata include the following items...</ListItem>
                      <ListItem>The cmail server stores encrypted message content designated to be decrypted and read by messages' receivers. It doesn't have access to the decrypted content.</ListItem>
                      <ListItem>The cmail server stores and publicly shares meta-data about your cmail account usage that is used to compute your public cmail reputation and makes it available to anyone. This data includes the following items:</ListItem>
                  </List>
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                  <Header>Cmail Alpha Privacy Policy</Header>
              </Segment>
              <Segment>
                  <List bulleted>
                      <List.Item>The cmail server stores cmail users' public account information provided by users to cmail, and makes it publicly available for anyone. Only set cmail account information that you are comfortable with being publicly shared with anyone.</List.Item>
                      <List.Item>The cmail servers stores metadata about your messages, messages threads, inbox, sent items and archive thread boxes. This metadata include the following items...</List.Item>
                      <List.Item>The cmail server stores encrypted message content designated to be decrypted and read by messages' receivers. It doesn't have access to the decrypted content.</List.Item>
                      <List.Item>The cmail server stores and publicly shares meta-data about your cmail account usage that is used to compute your public cmail reputation and makes it available to anyone. This data includes the following items:</List.Item>
                  </List>
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                  <Header>Web Site Source Code and License</Header>
                  <div>This web site source code, (including Cmail Alpha web client source code) is open source software available on Github. This web site source code license is available here</div>
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                  <Header>Web Site Content Copyright</Header>
                  <div>This work is licensed under a <a rel="noreferrer" target='_blank' href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.</div>
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                  <Header>Agreement to Terms of Use and to Ownership of Site</Header>
                  <div>
                        <p>These Terms and Conditions of Use (the "Terms of Use") apply to the cmail web site located at cmail.wtf (collectively, the "Site"). The Site is the property of Cmail DAO. ("Camil DAO") and its licensors. BY USING THE SITE, YOU AGREE TO THESE TERMS OF USE; IF YOU DO NOT AGREE, DO NOT USE THE SITE.</p>
                        <p>Cmail DAO reserves the right, at its sole discretion, to change, modify, add or remove portions of these Terms of Use, at any time. It is your responsibility to check these Terms of Use periodically for changes. Your continued use of the Site following the posting of changes will mean that you accept and agree to the changes. As long as you comply with these Terms of Use, cmail DAO grants you a personal, non-exclusive, non-transferable, limited privilege to enter and use the Site.</p>
                  </div>
                  <Header>Your Use of the Site</Header>
                  <div>
                        <p>You may not use any "deep-link", "page-scrape", "robot", "spider" or other automatic device, program, algorithm or methodology, or any similar or equivalent manual process, to access, acquire, copy or monitor any portion of the Site or any Content, or in any way reproduce or circumvent the navigational structure or presentation of the Site or any Content, to obtain or attempt to obtain any materials, documents or information through any means not purposely made available through the Site. Cmail DAO reserves the right to bar any such activity.</p>
                        <p>You may not attempt to gain unauthorized access to any portion or feature of the Site, or any other systems or networks connected to the Site or to any Cmail DAO server, or to any of the services offered on or through the Site, by hacking, password "mining" or any other illegitimate means.</p>
                        <p>You may not probe, scan or test the vulnerability of the Site or any network connected to the Site, nor breach the security or authentication measures on the Site or any network connected to the Site. You may not reverse look-up, trace or seek to trace any information on any other user of or visitor to the Site, or any other customer of Cmail DAO, including any cmail account not owned by you, to its source, or exploit the Site or any service or information made available or offered by or through the Site, in any way where the purpose is to reveal any information, including but not limited to personal identification or information, other than your own information, as provided for by the Site.</p>
                        <p>You agree that you will not take any action that imposes an unreasonable or disproportionately large load on the infrastructure of the Site or Cmail DAO systems or networks, or any systems or networks connected to the Site or to Cmail DAO.</p>
                        <p>You agree not to use any device, software or routine to interfere or attempt to interfere with the proper working of the Site or any transaction being conducted on the Site, or with any other person’s use of the Site.</p>
                        <p>You may not forge headers or otherwise manipulate identifiers in order to disguise the origin of any message or transmittal you send to Cmail DAO on or through the Site or any service offered on or through the Site. You may not pretend that you are, or that you represent, someone else, or impersonate any other individual or entity.</p>
                        <p>You may not use the Site or any Content for any purpose that is unlawful or prohibited by these Terms of Use, or to solicit the performance of any illegal activity or other activity which infringes the rights of Cmail DAO or others.</p>
                  </div>
                  <Header>Accounts, Passwords and Security</Header>
                  <div>
                      <p>Certain features or services offered on or through the Site may require you to open an account. You are entirely responsible for maintaining the confidentiality of the information you hold for your account, including your password, and for any and all activity that occurs under your account as a result of your failing to keep this information secure and confidential. You agree to notify Cmail DAO immediately of any unauthorized use of your account or password, or any other breach of security. You may be held liable for losses incurred by Cmail DAO or any other user of or visitor to the Site due to someone else using your Cmail DAO ID, password or account as a result of your failing to keep your account information secure and confidential.</p>
                      <p>You may not use anyone else’s account at any time without the express permission and consent of the holder of that account. Cmail DAO cannot and will not be liable for any loss or damage arising from your failure to comply with these obligations.</p>
                  </div>
                  <Header>Disclaimers</Header>
                  <div>
                      <p>CMAIL DAO DOES NOT PROMISE THAT THE SITE OR ANY CONTENT, SERVICE OR FEATURE OF THE SITE WILL BE ERROR-FREE OR UNINTERRUPTED, OR THAT ANY DEFECTS WILL BE CORRECTED, OR THAT YOUR USE OF THE SITE WILL PROVIDE SPECIFIC RESULTS. THE SITE AND ITS CONTENT ARE DELIVERED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. ALL INFORMATION PROVIDED ON THE SITE IS SUBJECT TO CHANGE WITHOUT NOTICE. CMAIL DAO CANNOT ENSURE THAT ANY FILES OR OTHER DATA YOU DOWNLOAD FROM THE SITE WILL BE FREE OF VIRUSES OR CONTAMINATION OR DESTRUCTIVE FEATURES. CMAIL DAO DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTIES OF ACCURACY, NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. CMAIL DAO DISCLAIMS ANY AND ALL LIABILITY FOR THE ACTS, OMISSIONS AND CONDUCT OF ANY THIRD PARTIES IN CONNECTION WITH OR RELATED TO YOUR USE OF THE SITE AND/OR ANY CMAIL DAO SERVICES. YOU ASSUME TOTAL RESPONSIBILITY FOR YOUR USE OF THE SITE AND ANY LINKED SITES. YOUR SOLE REMEDY AGAINST CMAIL DAO FOR DISSATISFACTION WITH THE SITE OR ANY CONTENT IS TO STOP USING THE SITE OR ANY SUCH CONTENT. THIS LIMITATION OF RELIEF IS A PART OF THE BARGAIN BETWEEN THE PARTIES.</p>
                      <p>The above disclaimer applies to any damages, liability or injuries caused by any failure of performance, error, omission, interruption, deletion, defect, delay in operation or transmission, computer virus, communication line failure, theft or destruction of or unauthorized access to, alteration of, or use, whether for breach of contract, tort, negligence or any other cause of action.</p>
                      <p>Cmail DAO reserves the right to do any of the following, at any time, without notice: (1) to modify, suspend or terminate operation of or access to the Site, or any portion of the Site, for any reason; (2) to modify or change the Site, or any portion of the Site, and any applicable policies or terms; and (3) to interrupt the operation of the Site, or any portion of the Site, as necessary to perform routine or non-routine maintenance, error correction, or other changes.</p>
                  </div>
                  <Header>Limitation of Liability</Header>
                  <div>
                      <p>Except where prohibited by law, in no event will Cmail DAO be liable to you for any indirect, consequential, exemplary, incidental or punitive damages, including lost profits, even if Cmail DAO has been advised of the possibility of such damages.
                      </p><p>If, notwithstanding the other provisions of these Terms of Use, Cmail DAO is found to be liable to you for any damage or loss which arises out of or is in any way connected with your use of the Site or any Content, Cmail DAO’s liability shall in no event exceed the greater of US$100.00. Some jurisdictions do not allow limitations of liability, so the foregoing limitation may not apply to you.</p>
                  </div>
                  <Header>Indemnity</Header>
                  <div>
                      <p>You agree to indemnify and hold Cmail DAO, its officers, directors, shareholders, predecessors, successors in interest, employees, agents, subsidiaries and affiliates, harmless from any demands, loss, liability, claims or expenses (including attorneys’ fees), made against CMAIL Dao by any third party due to or arising out of or in connection with your use of the Site.</p>
                  </div>

                  <Header>Violation of These Terms of Use</Header>
                  <div>
                      <p>Cmail DAO may disclose any information we have about you (including your identity) if we determine that such disclosure is necessary in connection with any investigation or complaint regarding your use of the Site, or to identify, contact or bring legal action against someone who may be causing injury to or interference with (either intentionally or unintentionally) Cmail DOO’s rights or property, or the rights or property of visitors to or users of the Site, including Cmail DAO’s customers. Cmail DAO reserves the right at all times to disclose any information that Cmail DAO deems necessary to comply with any applicable law, regulation, legal process or governmental request. Cmail DAO also may disclose your information when Cmail DAO determines that applicable law requires or permits such disclosure, including exchanging information with other companies and organizations for fraud protection purposes.
                      </p><p>You acknowledge and agree that Cmail DAO may preserve any transmittal or communication by you with Cmail DAO through the Site or any service offered on or through the Site, and may also disclose such data if required to do so by law or Cmail DAO determines that such preservation or disclosure is reasonably necessary to (1) comply with legal process, (2) enforce these Terms of Use, (3) respond to claims that any such data violates the rights of others, or (4) protect the rights, property or personal safety of Cmail DAO, its employees, users of or visitors to the Site, and the public.
                  </p><p>You agree that Cmail DAO may, in its sole discretion and without prior notice, terminate your access to the Site and/or block your future access to the Site if we determine that you have violated these Terms of Use or other agreements or guidelines which may be associated with your use of the Site. You also agree that any violation by you of these Terms of Use will constitute an unlawful and unfair business practice, and will cause irreparable harm to Cmail DAO, for which monetary damages would be inadequate, and you consent to Cmail DAO obtaining any injunctive or equitable relief that Cmail DAO deems necessary or appropriate in such circumstances. These remedies are in addition to any other remedies Cmail DAO may have at law or in equity.
                  </p><p>You agree that Cmail DAO may, in its sole discretion and without prior notice, terminate your access to the Site, for cause, which includes (but is not limited to) (1) requests by law enforcement or other government agencies, (2) a request by you (self-initiated account deletions), (3) discontinuance or material modification of the Site or any service offered on or through the Site, or (4) unexpected technical issues or problems.
                  </p><p>If Cmail DAO does take any legal action against you as a result of your violation of these Terms of Use, Cmail DAO will be entitled to recover from you, and you agree to pay, all reasonable attorneys’ fees and costs of such action, in addition to any other relief granted to Cmail DAO. You agree that Cmail DAO will not be liable to you or to any third party for termination of your access to the Site as a result of any violation of these Terms of Use.</p>
                  </div>
                  <Header>Governing Law amd Dispute Resolution</Header>
                    <div>
                        <p>Cmail DAO may disclose any information we have about you (including your identity) if we determine that such disclosure is necessary in connection with any investigation or complaint regarding your use of the Site, or to identify, contact or bring legal action against someone who may be causing injury to or interference with (either intentionally or unintentionally) Cmail DOO’s rights or property, or the rights or property of visitors to or users of the Site, including Cmail DAO’s customers. Cmail DAO reserves the right at all times to disclose any information that Cmail DAO deems necessary to comply with any applicable law, regulation, legal process or governmental request. Cmail DAO also may disclose your information when Cmail DAO determines that applicable law requires or permits such disclosure, including exchanging information with other companies and organizations for fraud protection purposes.
                        </p><p>You acknowledge and agree that Cmail DAO may preserve any transmittal or communication by you with Cmail DAO through the Site or any service offered on or through the Site, and may also disclose such data if required to do so by law or Cmail DAO determines that such preservation or disclosure is reasonably necessary to (1) comply with legal process, (2) enforce these Terms of Use, (3) respond to claims that any such data violates the rights of others, or (4) protect the rights, property or personal safety of Cmail DAO, its employees, users of or visitors to the Site, and the public.
                        </p><p>You agree that Cmail DAO may, in its sole discretion and without prior notice, terminate your access to the Site and/or block your future access to the Site if we determine that you have violated these Terms of Use or other agreements or guidelines which may be associated with your use of the Site. You also agree that any violation by you of these Terms of Use will constitute an unlawful and unfair business practice, and will cause irreparable harm to Cmail DAO, for which monetary damages would be inadequate, and you consent to Cmail DAO obtaining any injunctive or equitable relief that Cmail DAO deems necessary or appropriate in such circumstances. These remedies are in addition to any other remedies Cmail DAO may have at law or in equity.
                        </p><p>You agree that Cmail DAO may, in its sole discretion and without prior notice, terminate your access to the Site, for cause, which includes (but is not limited to) (1) requests by law enforcement or other government agencies, (2) a request by you (self-initiated account deletions), (3) discontinuance or material modification of the Site or any service offered on or through the Site, or (4) unexpected technical issues or problems.
                    </p><p>If Cmail DAO does take any legal action against you as a result of your violation of these Terms of Use, Cmail DAO will be entitled to recover from you, and you agree to pay, all reasonable attorneys’ fees and costs of such action, in addition to any other relief granted to Cmail DAO. You agree that Cmail DAO will not be liable to you or to any third party for termination of your access to the Site as a result of any violation of these Terms of Use.</p>
                    </div>

                  <Header>Miscellaneous</Header>
                  <div>
                      If any of the provisions of these Terms of Use are held by a court or other tribunal of competent jurisdiction to be void or unenforceable, such provisions shall be limited or eliminated to the minimum extent necessary and replaced with a valid provision that best embodies the intent of these Terms of Use, so that these Terms of Use shall remain in full force and effect. These Terms of Use constitute the entire agreement between you and Cmail DAO with regard to your use of the Site, and any and all other written or oral agreements or understandings previously existing between you and Cmail DAO with respect to such use are hereby superseded and cancelled. Other than as provided in a purchase agreement you enter into with Cmail DAO, Cmail DAO will not accept any counter-offers to these Terms of Use, and all such offers are hereby categorically rejected. Cmail DAO’s failure to insist on or enforce strict performance of these Terms of Use shall not be construed as a waiver by Cmail DAO of any provision or any right it has to enforce these Terms of Use, nor shall any course of conduct between Cmail DAO and you or any other party be deemed to modify any provision of these Terms of Use. These Terms of Use shall not be interpreted or construed to confer any rights or remedies on any third parties.
                  </div>
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment>
                  <Header>Feedback and Information</Header>
                  <List bulleted>
                      <ListItem>The information contained in this web site is subject to change without notice</ListItem>
                      <ListItem>Email any inquiries about these terms to the Cmail DAO at cmdev2@protonmail.com</ListItem>
                      <ListItem>This page updated by the Cmail DAO on September 12th, 2021</ListItem>
                  </List>
              </Segment>
          </SegmentGroup>
          <SegmentGroup>
              <Segment style={{marginBottom:'36px'}}>
                  <Footer/>
              </Segment>
          </SegmentGroup>
      </Container>)
}

export default Terms
