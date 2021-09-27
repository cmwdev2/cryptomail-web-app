import CryptoUtils from './crypto'
import * as aesjs from 'aes-js'
import { waitReady } from '@polkadot/wasm-crypto'

describe('crypto utils', () => {
  const mnemonic1 = "color stock pepper believe couch canyon dirt quarter pet apart same frown"
  const seed1 = "2dbac28b8a530e438fad7ba3614afbae"
  const password1 = "weakpassword123!"
  const aeskey1 = "f7081bc43698539c529ddbc7ef9925b35233698a54d828146f35c2ecd09dfcff"
  const aeskey_len_bytes = 32
  const seed_length_bytes = 16 // from 12 words
  const expected_entropy1 = "ae6ff0ff0e7f19a5fa576ec449715a449b82b49d69aaa84d152c6160408f7a1b"
  const expected_entropy2 = "7b1bbf42053fb25afdf4bcff7144692228aff84f3fff1b18629374fa2adcf508"
  const entropy_length_bytes = 32
  const clearText = "this is clear text data"

  beforeEach(async (): Promise<void> => {
    await waitReady()
  })

  it('new mnemonic and seed', () => {
    // new random mnemonic
    const mnemonic: string = CryptoUtils.generateMnemonic(12)
    expect(mnemonic.length > 0)

    // create see from mnemonic
    const seed: string = CryptoUtils.mnemonicToSeed(mnemonic)

    // check that seed is expected length
    const seedBytes = aesjs.utils.hex.toBytes(seed)
    expect(seedBytes.length).toEqual(seed_length_bytes)

    // generate a mnemonic from the seed
    const res: string = CryptoUtils.seedToMnemonic(seed)
    expect(res).toEqual(mnemonic)
  })

  it('seed from mnemonic', () => {
    const seed: string = CryptoUtils.mnemonicToSeed(mnemonic1)
    expect(seed).toEqual(seed1)
    const bytes = aesjs.utils.hex.toBytes(seed)
    expect(bytes.length).toEqual(seed_length_bytes)
  })

  it('mnemonic from seed', () => {
    const res: string = CryptoUtils.seedToMnemonic(seed1)
    expect(res).toEqual(mnemonic1)
  })

  it('deterministic aes encryption key from password', () => {
    const key: string = CryptoUtils.getEncryptionKey(password1)
    // console.log("aes generated key: " + key)
    expect(key).toEqual(aeskey1)
    const keyBytes = aesjs.utils.hex.toBytes(key)
    expect(keyBytes.length).toEqual(aeskey_len_bytes)
  })

  it('deterministic entropy derived key from seed', () => {
    const entropy1: string = CryptoUtils.derivePrivateKeySeed(seed1, 1)
    // console.log("master seed: " + seed1)
    // console.log("derived entropy1: " + entropy1)
    expect(seed1 != entropy1)
    expect(entropy1).toEqual(expected_entropy1)
    const bytes = aesjs.utils.hex.toBytes(entropy1)
    expect(bytes.length).toEqual(entropy_length_bytes)

    const entropy2: string = CryptoUtils.derivePrivateKeySeed(seed1, 2)
    // console.log("derived entropy2: " + entropy2)
    expect(seed1 != entropy2)
    expect(entropy1 != entropy2)
    expect(entropy2).toEqual(expected_entropy2)
    const bytes1 = aesjs.utils.hex.toBytes(entropy2)
    expect(bytes1.length).toEqual(entropy_length_bytes)
  })

  it('reject invalid derive index', () => {
      expect( () => {CryptoUtils.derivePrivateKeySeed(seed1, 0)}).toThrow(Error)
  })

  it('aes encryption', () => {
    const clearTextBytes = aesjs.utils.utf8.toBytes(clearText)
    const clearTextHexString = aesjs.utils.hex.fromBytes(clearTextBytes)
    let cypherTextHexString = CryptoUtils.aes_encrypt(aeskey1, clearTextHexString)
    let clearTextHexString1 = CryptoUtils.aes_decrypt(aeskey1, cypherTextHexString)
    expect(clearTextHexString1).toEqual(clearTextHexString)
    let clearText1Bytes = aesjs.utils.hex.toBytes(clearTextHexString1)
    let clearText1 = aesjs.utils.utf8.fromBytes(clearText1Bytes)
    expect(clearText1).toEqual(clearText)
  })

  it('aes encryption_iu8', () => {
    const clearTextBytes = aesjs.utils.utf8.toBytes(clearText)
    const keyBytes: Uint8Array = aesjs.utils.hex.toBytes(aeskey1)
    let cypherTextBytes = CryptoUtils.aes_encrypt_ui8(keyBytes, clearTextBytes)
    let clearTextBytes1 = CryptoUtils.aes_decrypt_ui8(keyBytes, cypherTextBytes)
    expect(clearTextBytes).toEqual(clearTextBytes1)
  })
})
