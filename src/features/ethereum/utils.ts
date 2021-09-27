import {utils} from 'ethers'
import {getRootState} from '../../app/store'

// Return USD price estimate for an amount of wei
function weiUsdEstimate(amount: string) : string {
    const state = getRootState()

    const price = state.ethereum.usdPrice
    if (price === 0) {
        return ""
    }

    const ethEstimate = utils.formatEther(amount)
    const ethNum = parseFloat(ethEstimate)
    return (ethNum * price).toFixed(2)
}

// Format a wei amount in eth and usd
export function formatWeiAmount(amountWei: string) {
    const eth = utils.formatEther(amountWei)

    const price = weiUsdEstimate(amountWei)
    if (price === "") {
        return eth + " ETH"
    }

    return eth  + " ETH ($" + price + " USD)"
}

// Returns usd price estimate display string for an eth amount
export function getUsdPriceEstimate(amountEth: string) {
    const state = getRootState()

    const price = state.ethereum.usdPrice
    if (price === 0) {
        return ""
    }

    const ethNum = parseFloat(amountEth)
    if (Number.isNaN(ethNum)) {
        return ""
    }

    const usdPrice = (ethNum * price).toFixed(2)
    return "($" + usdPrice + " USD)"
}
