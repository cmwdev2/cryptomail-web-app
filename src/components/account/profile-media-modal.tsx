// @ts-ignore
import React, {SetStateAction} from 'react'
import {
    Button,
    Form,
    Modal,
    Image,
    Grid,
    GridColumn,
    FormInput,
    ModalActions,
    ModalHeader,
    ModalContent,
    Icon, Divider, List, ListItem, ListContent, Message
} from 'semantic-ui-react'

interface ProfileMediaModalProps {
    shouldOpen: boolean
    onOpenCallback: () => void
    onBackButtonClicked: () => void
    onNextButtonClicked: () => void
    hasLastError: boolean
    largeProfileImageUrl: string
    smallProfileImageUrl: string
    onLargeImageUrlInputTextChanged: (value: SetStateAction<string>) => void
    onSmallImageUrlInputTextChanged: (value: SetStateAction<string>) => void
    validateInput: () => boolean
    getInputErrorMessage: () => any
    getSignupErrorMessage: () => any
}

function ProfileMediaModal(props: ProfileMediaModalProps) {
    return (
            <Modal size='small'
                open={props.shouldOpen}>
                <ModalHeader>Profile Image</ModalHeader>
                <ModalContent style={{paddingTop:'0px'}}>
                        <Grid divided style={{marginTop:'8px'}}>
                            <GridColumn width={8} style={{paddingTop:'0px'}}>
                                <Image bordered={true}
                                       src={props.largeProfileImageUrl}
                                       style={{marginTop:'0px', marginBottom:'10px', width:'300px', height:'300px'}}>
                                </Image>
                                    <Form error>
                                        <FormInput fluid type='text'
                                                   label='Large image url'
                                                   id='large-image-url'
                                                   placeholder='https://site/profile_800x800.jpg'
                                                   labelPosition='right'
                                                   onChange={(e) => props.onLargeImageUrlInputTextChanged(e.target.value)}
                                                   value={props.largeProfileImageUrl}
                                                   focus={true}
                                        >
                                        </FormInput>
                                    </Form>
                            </GridColumn>
                            <GridColumn width={8} style={{paddingTop:'0px'}}>
                                    <Image circular={true}
                                           bordered={true}
                                           src={props.smallProfileImageUrl}
                                           style={{marginTop:'0px', marginBottom:'10px', width:'200px', height:'200px'}}>
                                    </Image>
                                    <Form error>
                                        <FormInput fluid type='text'
                                                   label='Small image url'
                                                   id='small-image-url'
                                                   placeholder='https://site/profile_300x300.jpg'
                                                   labelPosition='right'
                                                   onChange={(e) => props.onSmallImageUrlInputTextChanged(e.target.value)}
                                                   value={props.smallProfileImageUrl}
                                        >
                                        </FormInput>
                                    </Form>
                            </GridColumn>
                        </Grid>
                    <Divider/>
                    {props.getSignupErrorMessage()}
                    {props.getInputErrorMessage()}
                    <List>
                        <ListItem>
                            <Icon name='check' color='green'/>
                            <ListContent>
                                Cmail doesn't store users' images yet so please enter one large square image (at least 800x800 pixels) url, oen small square (about 200x200 pixels) url.
                            </ListContent>
                        </ListItem>
                        <ListItem>
                            <Icon name='check' color='green'/>
                            <ListContent>
                                You can use a jpeg, png or even a gif animation!
                            </ListContent>
                        </ListItem>
                        <ListItem>
                            <Icon name='check' color='green'/>
                            <ListContent>
                                You must use an image served over https. http is not supported.
                            </ListContent>
                        </ListItem>
                        <ListItem>
                            <Icon name='check' color='green'/>
                            <ListContent>
                                You can set your profile image later via your cmail settings.
                            </ListContent>
                        </ListItem>
                        <ListItem>
                            <Icon name='check' color='green'/>
                            <ListContent>
                                Please only use images that you have copyrights for
                            </ListContent>
                        </ListItem>
                    </List>
                    <Message warning>
                        By signing up, you agree to cmail <a href='/terms' target='_blank' rel='license'>Terms of Service and Privacy Policy</a>.
                    </Message>
                </ModalContent>
                <ModalActions>
                    <Button icon labelPosition='left' onClick={props.onBackButtonClicked}><Icon name='angle left' />Back</Button>
                    <Button
                        content="Sign Up"
                        onClick={props.onNextButtonClicked}
                        color='blue'
                        />
                </ModalActions>
            </Modal>
    )
}

export default ProfileMediaModal
