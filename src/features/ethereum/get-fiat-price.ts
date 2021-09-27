import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch} from '../../app/store'
import {
    GetCoinPriceRequest,
    GetCoinPriceResponse
} from '../../proto/api/api_types_pb'
import {grpc} from '@improbable-eng/grpc-web'
import {CryptomailApiService} from '../../proto/api/api_pb_service'
import {api_url} from '../../common/config'
import {setUsdPriceEstimate} from './ethereum-slice'

export interface GetPriceParams {
    symbol: string
}

export const getEthPrice = createAsyncThunk(
    'messages/get-eth-price',
    async (params: GetPriceParams, thunkAPI : AsyncThunkConfig) => {
        const dispatch: AppDispatch = thunkAPI.dispatch!
        const req = new GetCoinPriceRequest()
        req.setSymbol("ETH")
        req.setCurrenciesList(["USD"])

        grpc.unary(CryptomailApiService.GetCoinPrice, {
                request: req,
                host: api_url,
                onEnd: (output: grpc.UnaryOutput<GetCoinPriceResponse>) => {
                    if (output.status !== grpc.Code.OK || output.message === null) {
                        console.error("Eth price server returned error to call. Code: " + output.status)
                        return
                    }

                    const price = output.message!.getPricesList()![0]
                    dispatch(setUsdPriceEstimate(price.getPrice()))
                }
            }
        )
    })
