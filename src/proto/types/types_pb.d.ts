// package: types
// file: types/types.proto

import * as jspb from "google-protobuf";

export class PublicKey extends jspb.Message {
  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublicKey.AsObject;
  static toObject(includeInstance: boolean, msg: PublicKey): PublicKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PublicKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublicKey;
  static deserializeBinaryFromReader(message: PublicKey, reader: jspb.BinaryReader): PublicKey;
}

export namespace PublicKey {
  export type AsObject = {
    key: Uint8Array | string,
  }
}

export class PrivateKey extends jspb.Message {
  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PrivateKey.AsObject;
  static toObject(includeInstance: boolean, msg: PrivateKey): PrivateKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PrivateKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PrivateKey;
  static deserializeBinaryFromReader(message: PrivateKey, reader: jspb.BinaryReader): PrivateKey;
}

export namespace PrivateKey {
  export type AsObject = {
    key: Uint8Array | string,
  }
}

export class Keypair extends jspb.Message {
  getPrivateKey(): Uint8Array | string;
  getPrivateKey_asU8(): Uint8Array;
  getPrivateKey_asB64(): string;
  setPrivateKey(value: Uint8Array | string): void;

  getPublicKey(): Uint8Array | string;
  getPublicKey_asU8(): Uint8Array;
  getPublicKey_asB64(): string;
  setPublicKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Keypair.AsObject;
  static toObject(includeInstance: boolean, msg: Keypair): Keypair.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Keypair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Keypair;
  static deserializeBinaryFromReader(message: Keypair, reader: jspb.BinaryReader): Keypair;
}

export namespace Keypair {
  export type AsObject = {
    privateKey: Uint8Array | string,
    publicKey: Uint8Array | string,
  }
}

export class EthAddress extends jspb.Message {
  getBytes(): Uint8Array | string;
  getBytes_asU8(): Uint8Array;
  getBytes_asB64(): string;
  setBytes(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EthAddress.AsObject;
  static toObject(includeInstance: boolean, msg: EthAddress): EthAddress.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EthAddress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EthAddress;
  static deserializeBinaryFromReader(message: EthAddress, reader: jspb.BinaryReader): EthAddress;
}

export namespace EthAddress {
  export type AsObject = {
    bytes: Uint8Array | string,
  }
}

export class PreKey extends jspb.Message {
  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): void;

  getId(): number;
  setId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PreKey.AsObject;
  static toObject(includeInstance: boolean, msg: PreKey): PreKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PreKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PreKey;
  static deserializeBinaryFromReader(message: PreKey, reader: jspb.BinaryReader): PreKey;
}

export namespace PreKey {
  export type AsObject = {
    key: Uint8Array | string,
    id: number,
  }
}

export class PreKeys extends jspb.Message {
  clearPreKeysList(): void;
  getPreKeysList(): Array<PreKey>;
  setPreKeysList(value: Array<PreKey>): void;
  addPreKeys(value?: PreKey, index?: number): PreKey;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PreKeys.AsObject;
  static toObject(includeInstance: boolean, msg: PreKeys): PreKeys.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PreKeys, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PreKeys;
  static deserializeBinaryFromReader(message: PreKeys, reader: jspb.BinaryReader): PreKeys;
}

export namespace PreKeys {
  export type AsObject = {
    preKeysList: Array<PreKey.AsObject>,
  }
}

export class Amount extends jspb.Message {
  getToken(): TokenMap[keyof TokenMap];
  setToken(value: TokenMap[keyof TokenMap]): void;

  getAmount(): string;
  setAmount(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Amount.AsObject;
  static toObject(includeInstance: boolean, msg: Amount): Amount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Amount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Amount;
  static deserializeBinaryFromReader(message: Amount, reader: jspb.BinaryReader): Amount;
}

export namespace Amount {
  export type AsObject = {
    token: TokenMap[keyof TokenMap],
    amount: string,
  }
}

export class Payment extends jspb.Message {
  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): Amount | undefined;
  setAmount(value?: Amount): void;

  getTransactionId(): Uint8Array | string;
  getTransactionId_asU8(): Uint8Array;
  getTransactionId_asB64(): string;
  setTransactionId(value: Uint8Array | string): void;

  getPaidActionType(): PaidActionTypeMap[keyof PaidActionTypeMap];
  setPaidActionType(value: PaidActionTypeMap[keyof PaidActionTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Payment.AsObject;
  static toObject(includeInstance: boolean, msg: Payment): Payment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Payment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Payment;
  static deserializeBinaryFromReader(message: Payment, reader: jspb.BinaryReader): Payment;
}

export namespace Payment {
  export type AsObject = {
    amount?: Amount.AsObject,
    transactionId: Uint8Array | string,
    paidActionType: PaidActionTypeMap[keyof PaidActionTypeMap],
  }
}

export class MessageId extends jspb.Message {
  getMessageThreadId(): Uint8Array | string;
  getMessageThreadId_asU8(): Uint8Array;
  getMessageThreadId_asB64(): string;
  setMessageThreadId(value: Uint8Array | string): void;

  getThreadId(): Uint8Array | string;
  getThreadId_asU8(): Uint8Array;
  getThreadId_asB64(): string;
  setThreadId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageId.AsObject;
  static toObject(includeInstance: boolean, msg: MessageId): MessageId.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageId, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageId;
  static deserializeBinaryFromReader(message: MessageId, reader: jspb.BinaryReader): MessageId;
}

export namespace MessageId {
  export type AsObject = {
    messageThreadId: Uint8Array | string,
    threadId: Uint8Array | string,
  }
}

export class ThreadId extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ThreadId.AsObject;
  static toObject(includeInstance: boolean, msg: ThreadId): ThreadId.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ThreadId, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ThreadId;
  static deserializeBinaryFromReader(message: ThreadId, reader: jspb.BinaryReader): ThreadId;
}

export namespace ThreadId {
  export type AsObject = {
    id: Uint8Array | string,
  }
}

export class PaidAction extends jspb.Message {
  getPaidActionType(): PaidActionTypeMap[keyof PaidActionTypeMap];
  setPaidActionType(value: PaidActionTypeMap[keyof PaidActionTypeMap]): void;

  hasPrice(): boolean;
  clearPrice(): void;
  getPrice(): Amount | undefined;
  setPrice(value?: Amount): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaidAction.AsObject;
  static toObject(includeInstance: boolean, msg: PaidAction): PaidAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PaidAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaidAction;
  static deserializeBinaryFromReader(message: PaidAction, reader: jspb.BinaryReader): PaidAction;
}

export namespace PaidAction {
  export type AsObject = {
    paidActionType: PaidActionTypeMap[keyof PaidActionTypeMap],
    price?: Amount.AsObject,
  }
}

export class PaymentSettings extends jspb.Message {
  hasEthAddress(): boolean;
  clearEthAddress(): void;
  getEthAddress(): EthAddress | undefined;
  setEthAddress(value?: EthAddress): void;

  clearPaidActionsList(): void;
  getPaidActionsList(): Array<PaidAction>;
  setPaidActionsList(value: Array<PaidAction>): void;
  addPaidActions(value?: PaidAction, index?: number): PaidAction;

  getEthSignature(): Uint8Array | string;
  getEthSignature_asU8(): Uint8Array;
  getEthSignature_asB64(): string;
  setEthSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaymentSettings.AsObject;
  static toObject(includeInstance: boolean, msg: PaymentSettings): PaymentSettings.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PaymentSettings, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaymentSettings;
  static deserializeBinaryFromReader(message: PaymentSettings, reader: jspb.BinaryReader): PaymentSettings;
}

export namespace PaymentSettings {
  export type AsObject = {
    ethAddress?: EthAddress.AsObject,
    paidActionsList: Array<PaidAction.AsObject>,
    ethSignature: Uint8Array | string,
  }
}

export class DepositConfirmation extends jspb.Message {
  hasMessageId(): boolean;
  clearMessageId(): void;
  getMessageId(): MessageId | undefined;
  setMessageId(value?: MessageId): void;

  hasAmount(): boolean;
  clearAmount(): void;
  getAmount(): Amount | undefined;
  setAmount(value?: Amount): void;

  hasFrom(): boolean;
  clearFrom(): void;
  getFrom(): EthAddress | undefined;
  setFrom(value?: EthAddress): void;

  hasTo(): boolean;
  clearTo(): void;
  getTo(): EthAddress | undefined;
  setTo(value?: EthAddress): void;

  getBlockNum(): number;
  setBlockNum(value: number): void;

  getBlockHash(): Uint8Array | string;
  getBlockHash_asU8(): Uint8Array;
  getBlockHash_asB64(): string;
  setBlockHash(value: Uint8Array | string): void;

  getConfirmations(): number;
  setConfirmations(value: number): void;

  getBlockTime(): number;
  setBlockTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DepositConfirmation.AsObject;
  static toObject(includeInstance: boolean, msg: DepositConfirmation): DepositConfirmation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DepositConfirmation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DepositConfirmation;
  static deserializeBinaryFromReader(message: DepositConfirmation, reader: jspb.BinaryReader): DepositConfirmation;
}

export namespace DepositConfirmation {
  export type AsObject = {
    messageId?: MessageId.AsObject,
    amount?: Amount.AsObject,
    from?: EthAddress.AsObject,
    to?: EthAddress.AsObject,
    blockNum: number,
    blockHash: Uint8Array | string,
    confirmations: number,
    blockTime: number,
  }
}

export class PublicAccountInfo extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getFullName(): string;
  setFullName(value: string): void;

  getLocation(): string;
  setLocation(value: string): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): PublicKey | undefined;
  setPublicKey(value?: PublicKey): void;

  hasPreKey(): boolean;
  clearPreKey(): void;
  getPreKey(): PreKey | undefined;
  setPreKey(value?: PreKey): void;

  getEthName(): string;
  setEthName(value: string): void;

  getProfile(): string;
  setProfile(value: string): void;

  getOrgName(): string;
  setOrgName(value: string): void;

  getPosition(): string;
  setPosition(value: string): void;

  getProfileImageUrl(): string;
  setProfileImageUrl(value: string): void;

  getSmallProfileImageUrl(): string;
  setSmallProfileImageUrl(value: string): void;

  getCustomProfileBackgroundImageUrl(): string;
  setCustomProfileBackgroundImageUrl(value: string): void;

  clearProfileUrlsList(): void;
  getProfileUrlsList(): Array<WebResource>;
  setProfileUrlsList(value: Array<WebResource>): void;
  addProfileUrls(value?: WebResource, index?: number): WebResource;

  hasPaymentSettings(): boolean;
  clearPaymentSettings(): void;
  getPaymentSettings(): PaymentSettings | undefined;
  setPaymentSettings(value?: PaymentSettings): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PublicAccountInfo.AsObject;
  static toObject(includeInstance: boolean, msg: PublicAccountInfo): PublicAccountInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PublicAccountInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PublicAccountInfo;
  static deserializeBinaryFromReader(message: PublicAccountInfo, reader: jspb.BinaryReader): PublicAccountInfo;
}

export namespace PublicAccountInfo {
  export type AsObject = {
    name: string,
    fullName: string,
    location: string,
    publicKey?: PublicKey.AsObject,
    preKey?: PreKey.AsObject,
    ethName: string,
    profile: string,
    orgName: string,
    position: string,
    profileImageUrl: string,
    smallProfileImageUrl: string,
    customProfileBackgroundImageUrl: string,
    profileUrlsList: Array<WebResource.AsObject>,
    paymentSettings?: PaymentSettings.AsObject,
    signature: Uint8Array | string,
  }
}

export class WebResource extends jspb.Message {
  getWebResourceType(): WebResourcesTypesMap[keyof WebResourcesTypesMap];
  setWebResourceType(value: WebResourcesTypesMap[keyof WebResourcesTypesMap]): void;

  getName(): string;
  setName(value: string): void;

  getUrl(): string;
  setUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WebResource.AsObject;
  static toObject(includeInstance: boolean, msg: WebResource): WebResource.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WebResource, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WebResource;
  static deserializeBinaryFromReader(message: WebResource, reader: jspb.BinaryReader): WebResource;
}

export namespace WebResource {
  export type AsObject = {
    webResourceType: WebResourcesTypesMap[keyof WebResourcesTypesMap],
    name: string,
    url: string,
  }
}

export interface TokenMap {
  TOKEN_ETH: 0;
  TOKEN_USDC: 1;
  TOKEN_USDT: 2;
  TOKEN_DAI: 3;
}

export const Token: TokenMap;

export interface PaidActionTypeMap {
  PAID_ACTION_TYPE_UNSPECIFIED: 0;
  PAID_ACTION_TYPE_OPEN: 1;
  PAID_ACTION_TYPE_REPLY: 2;
  PAID_ACTION_TYPE_WATCH_VIDEO: 3;
  PAID_ACTION_TYPE_5_MIN_ZOOM: 4;
  PAID_ACTION_TYPE_10_MIN_ZOOM: 5;
  PAID_ACTION_TYPE_20_MIN_ZOOM: 6;
}

export const PaidActionType: PaidActionTypeMap;

export interface WebResourcesTypesMap {
  WEB_RESOURCES_TYPES_UNKNOWN: 0;
  WEB_RESOURCES_TYPES_WEBSITE: 1;
  WEB_RESOURCES_TYPES_TWITTER: 2;
  WEB_RESOURCES_TYPES_TELEGRAM: 3;
  WEB_RESOURCES_TYPES_LINKEDIN: 4;
}

export const WebResourcesTypes: WebResourcesTypesMap;

export interface MimeTypeMap {
  MIME_TYPE_TEXT_UTF8: 0;
  MIME_TYPE_IMAGE_PNG: 1;
  MIME_TYPE_IMAGE_JPG: 2;
  MIME_TYPE_IMAGE_GIF: 3;
  MIME_TYPE_TEXT_MD: 4;
}

export const MimeType: MimeTypeMap;

export interface CompressionMap {
  COMPRESSION_UNCOMPRESSED: 0;
  COMPRESSION_ZIP: 1;
}

export const Compression: CompressionMap;

