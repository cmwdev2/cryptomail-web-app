import {createAsyncThunk} from '@reduxjs/toolkit'
import {AsyncThunkConfig} from '../../common/types'
import {AppDispatch, RootState} from '../../app/store'
import CryptoUtils from '../crypo/crypto'
import {
    bulkUpdate,
    LocalAccountState,
    initialState
} from './account-slice'
import {setLastError} from '../app/app-slice'
import {createGetThreadBoxesRequest, getAccountAndThreadBoxesAction,} from './get-account-and-boxes-api'

import {grpc} from '@improbable-eng/grpc-web'
import {Account} from '../../proto/types/accounts_pb'
import {Keypair, PreKey, PublicKey, PublicAccountInfo} from '../../proto/types/types_pb'
import {base64} from 'ethers/lib/utils'
import {
    ed25519KeypairFromSeed,
} from '@polkadot/wasm-crypto'
import {u8aToHex} from '@polkadot/util'
import {ThreadBoxType} from '../../proto/types/content_pb'
import {FIRST_PREKEY_DERIVE_ID, USER_ACCOUNT_DERIVE_ID} from '../../common/config'

// Log in a user to his account using account name and password
export const interactiveLogin = createAsyncThunk(
    'account/interactive-login',
    async (user_input: {name: string, password: string, keep_signed_in: boolean}, thunkAPI : AsyncThunkConfig) => {

        const dispatch: AppDispatch = thunkAPI.dispatch!
        try {
            const state: RootState = thunkAPI.getState()
            let accountState: LocalAccountState = state.account
            console.log('interactive-login with: ' + user_input.name + ", " + user_input.password)

            const accounts: Array<string> = state.pub_accounts.accounts
            if (accounts.length !== 1) {
                console.error("unexpected number of pub accounts")
            }

            const serverAccountInfo = accounts[0]

            if (serverAccountInfo === null) {
                    dispatch(setLastError({
                            message: 'Cannot Login',
                            reason: 'App must have account for account name in state before trying to login',
                            code: grpc.Code.Internal
                    }))
                    return
            }

            if (accountState.enc_seed === null) {
                dispatch(setLastError({
                    message: 'Cannot Login',
                    reason: 'App must have encrypted user seed in order to login',
                    code: grpc.Code.Internal
                }))
                return
            }

            const account : Account = Account.deserializeBinary(base64.decode(serverAccountInfo))
            const account_info = account.getPublicAccountInfo()!

            if (account_info.getName() !== user_input.name) {
                console.error("mismatch betwee server name and user provided name")
            }


            console.log('account name from account is: ' + account_info.getName())

            // step 2 - generate account keypair from encoded seed in state
            // Take the encrypted seed from state, decrypt it using key derived from the user's password
            // and store it in state
            const enc_seed = accountState.enc_seed as string
            console.log("user provided password: " + user_input.password)
            const key = CryptoUtils.getEncryptionKey(user_input.password)
            const seed = CryptoUtils.aes_decrypt(key, enc_seed)

            // entropy for account key pair is at index 1
            const entropy = CryptoUtils.derivePrivateKeySeed(seed, USER_ACCOUNT_DERIVE_ID)
            const entropyBytes = CryptoUtils.hexToU8NoPrefix(entropy)

            const ed_key_pair = ed25519KeypairFromSeed(entropyBytes)
            const ed_public_key_data : Uint8Array = ed_key_pair.subarray(32, 64) // last 32 byte is public
            const ed_private_key_data : Uint8Array = ed_key_pair.subarray(0, 32) // first 32 bytes is private

            // compare public key with the known account public key from account_info in state
            const expectedPubKey = account_info.getPublicKey()!.getKey_asU8()

            // console.log("account public key from seed: " + ed_public_key_data.toString() )
            // console.log("expected public key from account info: " + expectedPubKey.toString())

            if (ed_public_key_data.toString() !== expectedPubKey.toString()) {
                    // the key derived from enc_seed using the user provided password is not the account's public key can't log int
                    console.log("Wrong password provided: " + user_input.password)
                    dispatch(setLastError({
                            message: 'Wrong password',
                            reason: 'Please make sure you are using your correct account password and try again',
                            code: grpc.Code.Unauthenticated
                    }))
                    return
            }

            const key_pair = new Keypair()
            key_pair.setPublicKey(ed_public_key_data)
            key_pair.setPrivateKey(ed_private_key_data)

            // console.log("Account public key: 0x" + CryptoUtils.u8aToHexNoPrefix(ed_public_key_data))
            // console.log("Account private key: 0x" + CryptoUtils.u8aToHexNoPrefix(ed_private_key_data))

            // store updated account state
            const new_account_state: LocalAccountState = Object.assign({}, initialState)
            new_account_state.enc_seed = accountState.enc_seed
            new_account_state.seed = seed
            new_account_state.key_pair = base64.encode(key_pair.serializeBinary())
            new_account_state.account = base64.encode(account.serializeBinary())
            new_account_state.keep_signed_in = user_input.keep_signed_in
            new_account_state.enc_outgoing_messages_keys = accountState.enc_outgoing_messages_keys
            new_account_state.name = account_info.getName()

            console.log("👍 user is signed in locally and app is about to query server for updated Account and Thread-boxes for the user")

            dispatch(bulkUpdate(new_account_state))

            // account first prekey (for debugging)
            /*
            const subnet_wasm = await import("@subnetter/subnet-wasm")
            const entropy1 = CryptoUtils.derivePrivateKeySeed(seed, FIRST_PREKEY_DERIVE_ID)
            const entropy_bytes1: Uint8Array = CryptoUtils.hexToU8NoPrefix(entropy1)
            const pre_key_private = subnet_wasm.x22519_static_secret_from_bytes(entropy_bytes1)
            const pre_key_public = subnet_wasm.x25519_create_public_key(pre_key_private)
            console.log("pre_key_private: " + u8aToHex(pre_key_private))
            console.log("pre_key_public: " + u8aToHex(pre_key_public))
             */


        } catch (err) {
            // console.log('failed to prepare data for interactive login:', err)
            dispatch(setLastError({
                    message: 'Login failed',
                    reason: 'Please check your account name and password and try again',
                    code: grpc.Code.Internal
            }))
        }

        // todo: add user settings to remove local seed, restore from backup seed or generated a new one (sign-up)
    }
)

// Log in a user to his account using account name and password
export const restoreAccount = createAsyncThunk(
    'account/restore-account',
    async (user_input: {name: string, mnemonic: string, password: string, keep_signed_in: boolean}, thunkAPI : AsyncThunkConfig) => {

        const dispatch: AppDispatch = thunkAPI.dispatch!
        try {

            const seed = CryptoUtils.mnemonicToSeed(user_input.mnemonic)
            const key = CryptoUtils.getEncryptionKey(user_input.password)
            const enc_seed = CryptoUtils.aes_encrypt(key, seed)

            // entropy for account key pair
            const entropy = CryptoUtils.derivePrivateKeySeed(seed, USER_ACCOUNT_DERIVE_ID)
            const entropy_bytes: Uint8Array = CryptoUtils.hexToU8NoPrefix(entropy)

            // create and sign account info with requested user account name
            const account_info = new PublicAccountInfo()

            // account keys
            const key_pair = ed25519KeypairFromSeed(entropy_bytes)
            const public_key_data = key_pair.subarray(32, 64) // last 32 byte is public
            const private_key_data = key_pair.subarray(0, 32) // first 32 bytes is private
            const account_key_pair = new Keypair()
            account_key_pair.setPrivateKey(private_key_data)
            account_key_pair.setPublicKey(public_key_data)
            const pub_key = new PublicKey()
            pub_key.setKey(public_key_data)
            account_info.setPublicKey(pub_key)

            const subnet_wasm = await import("@subnetter/subnet-wasm")

            // account x25519 first prekey
            const entropy1 = CryptoUtils.derivePrivateKeySeed(seed, FIRST_PREKEY_DERIVE_ID)
            const entropy_bytes1: Uint8Array = CryptoUtils.hexToU8NoPrefix(entropy1)
            const pre_key_private = subnet_wasm.x22519_static_secret_from_bytes(entropy_bytes1)
            const pre_key_public = subnet_wasm.x25519_create_public_key(pre_key_private)
            console.log("pre_key_private: " + u8aToHex(pre_key_private))
            console.log("pre_key_public: " + u8aToHex(pre_key_public))

            const pre_key_pair = new Keypair()
            pre_key_pair.setPrivateKey(pre_key_private)
            pre_key_pair.setPublicKey(pre_key_public)
            const pre_key = new PreKey()
            pre_key.setId(FIRST_PREKEY_DERIVE_ID)
            pre_key.setKey(pre_key_public)

            /*
            account_info.setPreKey(pre_key)
            account_info.setName(user_input.name)
            const account_info_bytes = account_info.serializeBinary()
            const signature = ed25519Sign(public_key_data, private_key_data, account_info_bytes)
            account_info.setSignature(signature)
            const isVerified = ed25519Verify(signature, account_info_bytes, public_key_data)
            console.log("signature verification: " + isVerified)
            */

            const accountState = {
                seed: seed,
                enc_seed: enc_seed,
                key_pair: base64.encode(account_key_pair.serializeBinary()),
                account: null,
                name: user_input.name, // store the user provided name
                keep_signed_in: user_input.keep_signed_in,
                enc_outgoing_messages_keys: null,
            }

            dispatch(bulkUpdate(accountState))

            // prepare signed request to get account and thread-boxes from the server using the account key pair
            // which was derived from the enc_seed response will update local account and account info
            const request = createGetThreadBoxesRequest(account_key_pair, ThreadBoxType.THREAD_BOX_TYPE_INBOX)
            dispatch(getAccountAndThreadBoxesAction(request))

        } catch (err) {
            // console.log('failed to prepare data for interactive login:', err)
            dispatch(setLastError({
                message: 'Login failed',
                reason: 'Please check your account name and password and try agin',
                code: grpc.Code.Internal
            }))
        }

        // todo: add user settings to remove local seed, restore from backup seed or generated a new one (sign-up)
    }
)
