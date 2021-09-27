// Crypto util functions
import { pbkdf2 } from '@ethersproject/pbkdf2'
import {toUtf8Bytes, UnicodeNormalizationForm} from '@ethersproject/strings'
import * as aesjs from 'aes-js'
import { bip39Generate, bip39ToEntropy, sha512 } from '@polkadot/wasm-crypto'
import {cryptoIsReady, cryptoWaitReady} from '@polkadot/util-crypto'
import {entropyToMnemonic} from '@polkadot/util-crypto/mnemonic/bip39'
import {u8aToHex} from '@polkadot/util'
import {ethers} from 'ethers'

// IMPORTANT: all inout and output hex strings in this class are hex strings without the 0x prefix
export default class CryptoUtils {

    static salt = 'cryptomail is just awesome'

    // wait until crypto lib is ready - should be called only once per app
    static async waitReady() : Promise<boolean> {
        const subnet_wasm = await import("@subnetter/subnet-wasm")

        // note: next line only in dev builds. Should be removed from production code
        await subnet_wasm.init_with_console_debug()

        if (!cryptoIsReady()) {
            return cryptoWaitReady()
        }
        return true
    }

    // Return a new Uint8Array of length random bytes
    static randomBytes(length: number) : Uint8Array {
        return ethers.utils.randomBytes(length)
    }

    // convert a hex string with the 0x prefix to Uint8Array
    static hexToU8NoPrefix(value: string) {
        // needed because what aes returns is not a kosher UIn8Array ???
        return Uint8Array.from(aesjs.utils.hex.toBytes(value))
    }

    // convert a UInt8array to hex with the 0x prefix
    static u8aToHex(value: Uint8Array) {
        return u8aToHex(value, -1, true)
    }


    // convert a hex string with the 0x prefix to Uint8Array
    static hexToU8(value: string) : Uint8Array {
        // needed because what aes returns is not a kosher UIn8Array ???
        return Uint8Array.from(aesjs.utils.hex.toBytes(value.substring(2)))
    }

    // return hex representation of a Uint8Array data
    static u8aToHexNoPrefix(value: Uint8Array) : string {
        return u8aToHex(value, -1, false)
    }

    // generate mnemonic. 12 words is 128-bits entropy - "foo love cat..."
    static generateMnemonic(words: 12 | 15 | 18 | 21 | 24): string {
        return bip39Generate(words)
    }

    // mnemonic string -> hex_seed. e.g. "house love space" -> 1233...
    // result is 16 bytes from 12 words and 32 bytes see from 24 words
    static mnemonicToSeed(mnemonic: string): string {
        return u8aToHex(bip39ToEntropy(mnemonic), -1, false)
    }

    // seed (hex string) -> mnemonic string e.g. "word1, word2, ..."
    static seedToMnemonic(seed: string): string {
        const entropy = aesjs.utils.hex.toBytes(seed)
        return entropyToMnemonic(entropy)
    }

    //////////////////////

    // returns the 32 bytes aes symmetric key from user provided password string (utf8 text) using kdf2 and salt
    // returned value is a hex string
    static getEncryptionKey(password: string): string {

        // todo: use wasm instead of js!! like this:
        // const res  = pbkdf2Encode(password, CryptoUtils.salt)
        // const data = res.password
        // return u8aToHex(data, -1, false).substring(64)

        let value = pbkdf2(toUtf8Bytes(password, UnicodeNormalizationForm.NFKD),
            toUtf8Bytes(CryptoUtils.salt, UnicodeNormalizationForm.NFKD), 2048, 64, "sha512")

        return value.substring(2).substring(64)

    }

    // derive random entropy (32 bytes) from random seed (hex string) and index (must be 1 or bigger)
    // Returns hex string
    static derivePrivateKeySeed(seed: string, index: number): string {
        if (index < 1) {
            throw new Error("invalid input - index must be >= 1")
        }

        const buffer1: Uint8Array = aesjs.utils.hex.toBytes(seed)
        const buffer2: Uint8Array = new Uint8Array([index])
        const buff = new Uint8Array(buffer1.length + buffer2.length)
        buff.set(buffer1, 0)
        buff.set(buffer2, buffer1.byteLength)
        const res = sha512(buff)
        return u8aToHex(res, -1, false).substring(64)
    }

    //////////////// aes encryption

    // 16 bytes aes init vector w/o hmac
    private static aes_iv = [ 0x1e, 0xff, 0x01, 0x32, 0xad, 0xfa, 0x24, 0x55, 0xe1, 0x94, 0x8d, 0x57, 0x3c, 0xaa, 0xf5, 0x82 ];

    // encrypt data using the provided aes key (32 bytes / 256 bits)
    // key and data must be hex strings. Returns hex string
    // input is a utf8 string which may be any cleartext - a hex string, a json string or arbitrary
    // we use AES-CBC mode without an HMAC since the message data is authenticated by author signature.
    static aes_encrypt(key: string, clearText: string): string {

        // todo: use rust-crypto-block_mode crate for aes-CBA in wasm for better performance over this pure javascript aes implementation

        const key_bytes: Uint8Array = aesjs.utils.hex.toBytes(key)
        if (key_bytes.length !== 32) {
            throw new Error("invalid encryption key length. Expected 32 bytes / 256 bit")
        }
        try {

            // const padded_clear_text_bytes = aesjs.padding.pkcs7.pad(clear_text_bytes)
            // const aes_cbc = new aesjs.ModeOfOperation.cbc(key_bytes, this.aes_iv)
            // const cypher_bytes = aes_cbc.encrypt(padded_clear_text_bytes)

            const clear_text_bytes: Uint8Array = aesjs.utils.hex.toBytes(clearText)
            const res = CryptoUtils.aes_encrypt_ui8(key_bytes, clear_text_bytes)
            return aesjs.utils.hex.fromBytes(res)
        } catch (error) {
            console.log("aes encryption error: ", error)
            throw new Error ("Failed to encrypt your data, invalid encryption key")
        }
    }

    // encrypt data using the provided aes key (32 bytes / 256 bits)
    // key and data must be hex strings. Returns hex string
    // input is a utf8 string which may be any cleartext - a hex string, a json string or arbitrary
    // we use AES-CBC mode without an HMAC since the message data is authenticated by author signature.
    static aes_encrypt_ui8(key: Uint8Array, clearText: Uint8Array): Uint8Array {

        // todo: use rust-crypto-block_mode crate for aes-CBA in wasm for better performance over this pure javascript aes implementation
        if (key.length !== 32) {
            throw new Error("invalid encryption key length. Expected 32 bytes / 256 bits")
        }

        try {
            const padded_clear_text = aesjs.padding.pkcs7.pad(clearText)
            const aes_cbc = new aesjs.ModeOfOperation.cbc(key, this.aes_iv)
            return aes_cbc.encrypt(padded_clear_text)
        } catch (error) {
            console.log("aes encryption error: ", error)
            throw new Error ("Failed to encrypt your data, invalid encryption key")
        }
    }

    // decrypt data using the provided aes key (32 bytes / 256 bits)
    // key and data must be hex strings. Returns the cleartext string that was encrypted (utf8 encoded)
    static aes_decrypt(key: string, cypherText: string): string {
        try {
            const key_bytes: Uint8Array = aesjs.utils.hex.toBytes(key)
            const cypher_text_bytes: Uint8Array = aesjs.utils.hex.toBytes(cypherText)
            const res = CryptoUtils.aes_decrypt_ui8(key_bytes, cypher_text_bytes)
            // const aes_cbc = new aesjs.ModeOfOperation.cbc(key_bytes, this.aes_iv)
            // const cleartext_padded_bytes = aes_cbc.decrypt(cypher_text_bytes)
            return aesjs.utils.hex.fromBytes(res)
        } catch (error) {
            console.log("aes decryption error: ", error)
            throw new Error ("Please check your account name and password and try again")
        }
    }

    // decrypt data using the provided aes key (64 bytes / 256 bit)
    // key and data must be hex strings. Returns the cleartext string that was encrypted (utf8 encoded)
    static aes_decrypt_ui8(key: Uint8Array, cypherText: Uint8Array): Uint8Array {

        // todo: use rust-crypto-block_mode crate for aes-CBA in wasm for better performance over this pure javascript aes implementation

        if (key.length !== 32) {
            throw new Error("invalid encryption key length. Expected 32 bytes / 256 bits")
        }

        try {
            const aes_cbc = new aesjs.ModeOfOperation.cbc(key, this.aes_iv)
            const clear_text_padded = aes_cbc.decrypt(cypherText)
            return aesjs.padding.pkcs7.strip(clear_text_padded)
        } catch (error) {
            console.log("aes decryption error: ", error)
            throw new Error ("Please check your account name and password and try again")
        }
    }
}
