// @ts-ignore
import React from 'react'

import {useAppDispatch, useAppSelector} from '../app/hooks'
import {AppError, setLastError} from '../features/app/app-slice'
import {Message} from 'semantic-ui-react'
import {grpc} from '@improbable-eng/grpc-web'
// import {createRef} from 'react'

function ErrorMessage() {

    const dispatch = useAppDispatch()

    function handleDismiss()  {
        dispatch(setLastError(null))
    }

    const hasLastError: boolean = useAppSelector((state) => {
        //return false
        return state.app.last_error !== null && state.app.last_error.code !== grpc.Code.AlreadyExists
    })

    // const isLoading: boolean = useAppSelector((state) => state.app.loading)
    const lastErrorMessage = useAppSelector((state) =>  {
        if (state.app.last_error !== null) {
            const err = state.app.last_error
            return err.message
        }
        return ""
    })

    const lastErrorMessageDetails: string = useAppSelector((state) => {
        if (state.app.last_error !== null) {
            return (state.app.last_error as AppError).reason + ". Error code: " + (state.app.last_error as AppError).code
        } else {
            return ""
        }
    })

    if (!hasLastError) {
        return null
    }

    return (
        <Message
            onDismiss={(_) => handleDismiss()}
            style={{ marginTop: '0px', zIndex:'999', height:'54px', color:'black', background:'orange', position:'fixed', width:'400px', left:'50%', marginLeft:'-200px', bottom:'0' }}
            size='tiny'
            transition
            header={lastErrorMessage}
            content={lastErrorMessageDetails}/>)
}

export default ErrorMessage
