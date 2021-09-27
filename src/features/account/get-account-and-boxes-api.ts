import {AppDispatch} from '../../app/store'
import {grpc} from '@improbable-eng/grpc-web'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {api_url} from '../../common/config'
import {setAccount} from './account-slice'
import {createAsyncThunk} from '@reduxjs/toolkit'
import {setLastError} from '../app/app-slice'
import {AsyncThunkConfig} from '../../common/types'
import {nanoSecsSinceEpoch} from '../../common/time'
import {
    GetThreadBoxesRequest,
    GetThreadBoxesResponse
} from '../../proto/api/api_types_pb'
import {Keypair, PublicKey} from '../../proto/types/types_pb'
import {ed25519Sign} from '@polkadot/wasm-crypto'
import {processServerThreadBoxes} from '../messaging/process-threadboxes'
import {getEthPrice} from '../ethereum/get-fiat-price'

// Create a new signed GetThreadBoxesRequest by the provided account key pair to get all thread boxes and updated account from the api server
export function createGetThreadBoxesRequest(key_pair: Keypair, thread_box_type: number) : GetThreadBoxesRequest {
    let request = new GetThreadBoxesRequest()
    const pub_key = new PublicKey()
    pub_key.setKey(key_pair.getPublicKey_asU8())
    request.setPublicKey(pub_key)
    request.setTimeStamp(nanoSecsSinceEpoch()) // need now in nano
    request.setThreadBoxes(thread_box_type)
    const req_data = request.serializeBinary()
    // const request_hash = sha512(req_data)
    // console.log("GetThreadBoxes request message sha512: " + u8aToHex(request_hash))
    // console.log("Private key: " + u8aToHex(key_pair.getPrivateKey_asU8()))
    const signature = ed25519Sign(key_pair.getPublicKey_asU8(), key_pair.getPrivateKey_asU8(), req_data)
    // console.log("Signature: " + u8aToHex(signature))
    // const verified = ed25519Verify(signature, req_data, key_pair.getPublicKey_asU8())
    // console.log("Verify signature: " + verified)
    request.setSignature(signature)
    return request
}

// Get the user's account and thread-boxes
export const getAccountAndThreadBoxesAction = createAsyncThunk(
'account/get-account-and-thread-boxes',
async (req: GetThreadBoxesRequest, thunkAPI : AsyncThunkConfig) => {

    const dispatch: AppDispatch = thunkAPI.dispatch!
    dispatch(setLastError(null))

    grpc.unary(CryptomailApiService.GetThreadBoxes, {
        request: req,
        host: api_url,
        onEnd: (output: grpc.UnaryOutput<GetThreadBoxesResponse>) => {
            if (output.status !== grpc.Code.OK) {
                dispatch(setLastError({
                    message: "Server Error",
                    reason: output.statusMessage,
                    code: output.status
                }))
                return
            }

            const account = output.message!.getAccount()
            if (!account) {
                dispatch(setAccount({account:null, accountName:null}))
                dispatch(setLastError({
                    message: "Server Error",
                    reason: "Account not recognized ",
                    code: grpc.Code.Internal
                }))
                return
            }

            const name = account!.getPublicAccountInfo()!.getName()
            console.log("🖖 Got account and thread-boxes from server. Account name: " + name + ". Updating account and accountInfo....")

            // store local account we got from server - it may have updated on another device...
            // dispatch(setAccount({account: base64.encode(account.serializeBinary()), accountName:name}))

            // let the messaging core process the thread boxes
            dispatch(processServerThreadBoxes(output.message!))

            dispatch(getEthPrice({
                symbol: "USD",
            }))
        }
    })
})


