// @ts-ignore
import React from 'react'
import {useEffect} from 'react'
import {useAppDispatch, useAppSelector} from '../app/hooks'
import {Button, CardGroup, Container, Message, MessageHeader} from 'semantic-ui-react'
import {RootState} from '../app/store'
import {getPublicAccounts} from '../features/public-accounts/public-accounts-server-api'
import {GetPublicAccountsRequest, } from '../proto/api/api_types_pb'
import {base64Decode} from '@polkadot/util-crypto'
import UserCard from './user-card'
import {Account} from '../proto/types/accounts_pb'
import Footer from './navigation/footer'
import {createSelector} from '@reduxjs/toolkit'
import {setAccounts} from '../features/public-accounts/public-accounts-slice'

function AllAccountsScreen() {

    const maxResultsPerQuery = 20

    const dispatch = useAppDispatch()

    const selectAllAccounts = createSelector(
        (state: RootState) => state.pub_accounts.accounts,
        (accounts) => {
            const result = new Array<Account>()
            for(const a of accounts) {
                const account = Account.deserializeBinary(base64Decode(a))
                result.push(account)
            }
            return result
        }
    )

    const allAccounts = useAppSelector(selectAllAccounts)
    const totalResults = useAppSelector((state) => state.pub_accounts.totalAccounts)
    const from = useAppSelector((state) => state.pub_accounts.from)
    const canLoadMore = totalResults !== allAccounts.length

    function loadAccounts() {
        const request = new GetPublicAccountsRequest()
        request.setMaxResults(maxResultsPerQuery)
        if (from !== null && from.length > 0) {
            request.setFrom(from)
        }
        dispatch(getPublicAccounts(request))
    }

    useEffect(() => {
        console.log("main effect")
        document.title = "CMAIL - Public Accounts"

        // clear all accounts - todo: support updating public accounts from previous view
        dispatch(setAccounts(new Array<string>()))
        const request = new GetPublicAccountsRequest()
        request.setMaxResults(maxResultsPerQuery)
        dispatch(getPublicAccounts(request))
    }, [dispatch])

    return (
        <Container fluid style={{ paddingLeft: '20px', paddingBottom:'40px', paddingTop: '20px', paddingRight:'20px',
            opacity: '80%', textAlign:'center', width:'100%'}}>
            <Message>
                <MessageHeader>
                    <h2>Public Users Directory</h2>
                </MessageHeader>
            </Message>
            <CardGroup style={{width:'100%', flexWrap:'wrap', justifyContent:'center', alignContent:'stretch'}}>
                {Array.from(allAccounts.values()).map((a,k) => <UserCard key={k} user={a} clickable={true} />)}
            </CardGroup>
           {canLoadMore && <Message>
                    <Button
                        onClick={(_) => loadAccounts()}
                        color='blue'>
                        Load more...
                    </Button>
                </Message>
            }
            <Message>
                <Footer/>
            </Message>
        </Container>
    )
}

export default AllAccountsScreen


