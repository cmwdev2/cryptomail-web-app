import {ethers} from 'ethers'
import CryptoUtils from '../features/crypo/crypto'

// Returns estimated number of nano seconds since the unix epoch
export function nanoSecsSinceEpoch() : number  {
    return 1000000 * Date.now()
}

// Return short checksum address from an eth address provided in binary format. e.g. 0x12eF...12fA
export function short_format_eth_address(address: Uint8Array) : string {
    const a = ethers.utils.getAddress(CryptoUtils.u8aToHexNoPrefix(address))
    return a.substring(0,6) + "..." + a.substring(a.length - 4)
}
// Return full eth address string (checksummed)
export function format_eth_address(address: Uint8Array) : string {
    return ethers.utils.getAddress(CryptoUtils.u8aToHexNoPrefix(address))
}

export function etherScanTransactionUrl(txHesh: string) {
    return 'https://etherscan.io/tx/' + txHesh
}

const msPerMinute = 60 * 1000
const msPerHour = msPerMinute * 60
const msPerDay = msPerHour * 24
const msPerMonth = msPerDay * 30
const msPerYear = msPerDay * 365

export function timeAgo(timeStampMs: number) : string {
    const elapsed = Date.now() - timeStampMs

    if (elapsed < msPerMinute) {
        const val =  Math.round(elapsed/1000)
        return val > 1 ?  val + ' seconds ago' : 'a second ago'
    } else if (elapsed < msPerHour) {
        const val = Math.round(elapsed/msPerMinute)
        return val > 1 ? val + ' minutes ago' : 'a minute ago'
    } else if (elapsed < msPerDay) {
        const val = Math.round(elapsed/msPerHour)
        return val > 1 ? val + ' hours ago' : 'an hour ago'
    } else if (elapsed < msPerMonth) {
        const val = Math.round(elapsed/msPerDay)
        return val > 1 ?  val + ' days ago' : 'Yesterday'
    } else if (elapsed < msPerYear) {
        const val = Math.round(elapsed/msPerDay)
        return val > 1 ? val + ' months ago' : 'a month ago'
    } else {
        const val = Math.round(elapsed/msPerYear)
        return val > 1 ? val +  ' years ago' : 'a year ago'
    }
}
