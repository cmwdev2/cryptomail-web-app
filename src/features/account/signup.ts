import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch} from '../../app/store'
import CryptoUtils from '../crypo/crypto'
import {
    bulkUpdate,
} from './account-slice'
import {setLastError} from '../app/app-slice'
import {newAccount} from './new-account-api'

import {Settings} from '../../proto/types/accounts_pb'
import {Keypair, PreKey, PublicKey, PublicAccountInfo} from '../../proto/types/types_pb'
import {CreateAccountRequest} from '../../proto/api/api_types_pb'
import {base64} from 'ethers/lib/utils'
import {nanoSecsSinceEpoch} from '../../common/time'
import {
    sha512,
    ed25519KeypairFromSeed,
    ed25519Sign,
    ed25519Verify
} from '@polkadot/wasm-crypto'
import {u8aToHex} from '@polkadot/util'
import {FIRST_PREKEY_DERIVE_ID, USER_ACCOUNT_DERIVE_ID} from '../../common/config'

// Data provided by user for creating a new account
export interface SignupParams {
    settings: Settings,
    account_info: PublicAccountInfo,
    password: string,
    keep_signed_in: boolean
}

// Signup the user
export const signup = createAsyncThunk(
    'account/signup',
    async (signupParams: SignupParams, thunkAPI : AsyncThunkConfig) => {
        console.log('signup() with user input: ' + signupParams.account_info.getName() + ", " + signupParams.password)
        const dispatch: AppDispatch = thunkAPI.dispatch!
        dispatch(setLastError(null))
        try {
            const subnet_wasm = await import("@subnetter/subnet-wasm")

            const mnemonic = CryptoUtils.generateMnemonic(12)
            console.log("Mnemonic: " + mnemonic)
            const seed = CryptoUtils.mnemonicToSeed(mnemonic)
            const key = CryptoUtils.getEncryptionKey(signupParams.password)
            const enc_seed = CryptoUtils.aes_encrypt(key, seed)

            const account_info = signupParams.account_info

            // account keys
            const entropy = CryptoUtils.derivePrivateKeySeed(seed, USER_ACCOUNT_DERIVE_ID)
            const entropyBytes: Uint8Array = CryptoUtils.hexToU8NoPrefix(entropy)
            const key_pair_data = ed25519KeypairFromSeed(entropyBytes)
            const public_key_data = key_pair_data.subarray(32, 64) // last 32 byte is public
            const private_key_data = key_pair_data.subarray(0, 32) // first 32 bytes is private
            console.log("Account public key: 0x" + u8aToHex(public_key_data))
            console.log("Account private key: 0x" + u8aToHex(private_key_data))
            const pub_key = new PublicKey()
            pub_key.setKey(public_key_data)
            account_info.setPublicKey(pub_key)
            const key_pair = new Keypair()
            key_pair.setPublicKey(public_key_data)
            key_pair.setPrivateKey(private_key_data)

            // first pre-key
            const entropy1 = CryptoUtils.derivePrivateKeySeed(seed, FIRST_PREKEY_DERIVE_ID)
            const entropyBytes1: Uint8Array = CryptoUtils.hexToU8NoPrefix(entropy1)
            const x_pre_key_private : Uint8Array = subnet_wasm.x22519_static_secret_from_bytes(entropyBytes1)
            const x_pre_key_public : Uint8Array = subnet_wasm.x25519_create_public_key(x_pre_key_private)
            console.log("x_pre_key_private: " + u8aToHex(x_pre_key_private))
            console.log("x_pre_key_public: " + u8aToHex(x_pre_key_public))

            const pre_key_pair = new Keypair()
            pre_key_pair.setPrivateKey(x_pre_key_private)
            pre_key_pair.setPublicKey(x_pre_key_public)
            const pre_key = new PreKey()
            pre_key.setId(FIRST_PREKEY_DERIVE_ID)
            pre_key.setKey(pre_key_pair.getPublicKey_asU8())
            account_info.setPreKey(pre_key)

            const account_info_bytes = account_info.serializeBinary()
            const signature = ed25519Sign(public_key_data, private_key_data, account_info_bytes)
            account_info.setSignature(signature)

            // verification of signature:
            const verified = ed25519Verify(signature, account_info_bytes, public_key_data)
            console.log("account info signature verified: " + verified)

            const accountState = {
                seed: seed,
                enc_seed: enc_seed,
                key_pair: base64.encode(key_pair.serializeBinary()),
                account: null,
                account_info: base64.encode(account_info.serializeBinary()),
                name: account_info.getName(), // store the user provided name
                keep_signed_in: signupParams.keep_signed_in,
                enc_outgoing_messages_keys: null,
            }

            dispatch(bulkUpdate(accountState))

            const request = new CreateAccountRequest()
            request.setSettings(signupParams.settings)
            request.setPublicAccountInfo(account_info)
            request.setTimeStamp(nanoSecsSinceEpoch())
            request.setPublicKey(pub_key)

            const request_bytes = request.serializeBinary()
            const request_hash = sha512(request_bytes)
            console.log("request sha512: " + u8aToHex(request_hash))
            const request_signature = ed25519Sign(public_key_data, private_key_data, request_bytes)
            request.setSignature(request_signature)

            // verify signature
            const isVerified = ed25519Verify(request_signature, request_bytes, public_key_data)
            console.log("signature verification: " + isVerified)

            // call the server with the data - result will be LastError or new Account state object in store
            dispatch(newAccount(request))

        } catch (error) {
            console.log("Signup error: " + error)
        }
    }
)
