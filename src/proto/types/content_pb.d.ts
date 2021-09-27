// package: types
// file: types/content.proto

import * as jspb from "google-protobuf";
import * as types_types_pb from "../types/types_pb";

export class Message extends jspb.Message {
  hasMessageId(): boolean;
  clearMessageId(): void;
  getMessageId(): types_types_pb.MessageId | undefined;
  setMessageId(value?: types_types_pb.MessageId): void;

  getAuthorData(): Uint8Array | string;
  getAuthorData_asU8(): Uint8Array;
  getAuthorData_asB64(): string;
  setAuthorData(value: Uint8Array | string): void;

  hasServerData(): boolean;
  clearServerData(): void;
  getServerData(): MessageServerData | undefined;
  setServerData(value?: MessageServerData): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Message.AsObject;
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Message;
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
  export type AsObject = {
    messageId?: types_types_pb.MessageId.AsObject,
    authorData: Uint8Array | string,
    serverData?: MessageServerData.AsObject,
    signature: Uint8Array | string,
  }
}

export class MessageUserdata extends jspb.Message {
  hasMessageId(): boolean;
  clearMessageId(): void;
  getMessageId(): types_types_pb.MessageId | undefined;
  setMessageId(value?: types_types_pb.MessageId): void;

  hasSenderPublicKey(): boolean;
  clearSenderPublicKey(): void;
  getSenderPublicKey(): types_types_pb.PublicKey | undefined;
  setSenderPublicKey(value?: types_types_pb.PublicKey): void;

  getCreated(): number;
  setCreated(value: number): void;

  hasPayment(): boolean;
  clearPayment(): void;
  getPayment(): types_types_pb.Payment | undefined;
  setPayment(value?: types_types_pb.Payment): void;

  getReplyTo(): Uint8Array | string;
  getReplyTo_asU8(): Uint8Array;
  getReplyTo_asB64(): string;
  setReplyTo(value: Uint8Array | string): void;

  hasRecipientPublicKey(): boolean;
  clearRecipientPublicKey(): void;
  getRecipientPublicKey(): types_types_pb.PublicKey | undefined;
  setRecipientPublicKey(value?: types_types_pb.PublicKey): void;

  hasEphPubKey(): boolean;
  clearEphPubKey(): void;
  getEphPubKey(): types_types_pb.PublicKey | undefined;
  setEphPubKey(value?: types_types_pb.PublicKey): void;

  getRecipientPreKeyId(): number;
  setRecipientPreKeyId(value: number): void;

  getContent(): Uint8Array | string;
  getContent_asU8(): Uint8Array;
  getContent_asB64(): string;
  setContent(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageUserdata.AsObject;
  static toObject(includeInstance: boolean, msg: MessageUserdata): MessageUserdata.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageUserdata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageUserdata;
  static deserializeBinaryFromReader(message: MessageUserdata, reader: jspb.BinaryReader): MessageUserdata;
}

export namespace MessageUserdata {
  export type AsObject = {
    messageId?: types_types_pb.MessageId.AsObject,
    senderPublicKey?: types_types_pb.PublicKey.AsObject,
    created: number,
    payment?: types_types_pb.Payment.AsObject,
    replyTo: Uint8Array | string,
    recipientPublicKey?: types_types_pb.PublicKey.AsObject,
    ephPubKey?: types_types_pb.PublicKey.AsObject,
    recipientPreKeyId: number,
    content: Uint8Array | string,
  }
}

export class MessagesIds extends jspb.Message {
  clearMessagesIdsList(): void;
  getMessagesIdsList(): Array<types_types_pb.MessageId>;
  setMessagesIdsList(value: Array<types_types_pb.MessageId>): void;
  addMessagesIds(value?: types_types_pb.MessageId, index?: number): types_types_pb.MessageId;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessagesIds.AsObject;
  static toObject(includeInstance: boolean, msg: MessagesIds): MessagesIds.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessagesIds, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessagesIds;
  static deserializeBinaryFromReader(message: MessagesIds, reader: jspb.BinaryReader): MessagesIds;
}

export namespace MessagesIds {
  export type AsObject = {
    messagesIdsList: Array<types_types_pb.MessageId.AsObject>,
  }
}

export class MessageKey extends jspb.Message {
  hasId(): boolean;
  clearId(): void;
  getId(): types_types_pb.MessageId | undefined;
  setId(value?: types_types_pb.MessageId): void;

  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageKey.AsObject;
  static toObject(includeInstance: boolean, msg: MessageKey): MessageKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageKey;
  static deserializeBinaryFromReader(message: MessageKey, reader: jspb.BinaryReader): MessageKey;
}

export namespace MessageKey {
  export type AsObject = {
    id?: types_types_pb.MessageId.AsObject,
    key: Uint8Array | string,
  }
}

export class MessageKeys extends jspb.Message {
  clearMessageKeysList(): void;
  getMessageKeysList(): Array<MessageKey>;
  setMessageKeysList(value: Array<MessageKey>): void;
  addMessageKeys(value?: MessageKey, index?: number): MessageKey;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageKeys.AsObject;
  static toObject(includeInstance: boolean, msg: MessageKeys): MessageKeys.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageKeys, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageKeys;
  static deserializeBinaryFromReader(message: MessageKeys, reader: jspb.BinaryReader): MessageKeys;
}

export namespace MessageKeys {
  export type AsObject = {
    messageKeysList: Array<MessageKey.AsObject>,
  }
}

export class MessageServerData extends jspb.Message {
  getOpened(): boolean;
  setOpened(value: boolean): void;

  getReplied(): boolean;
  setReplied(value: boolean): void;

  hasDepositData(): boolean;
  clearDepositData(): void;
  getDepositData(): DepositData | undefined;
  setDepositData(value?: DepositData): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageServerData.AsObject;
  static toObject(includeInstance: boolean, msg: MessageServerData): MessageServerData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageServerData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageServerData;
  static deserializeBinaryFromReader(message: MessageServerData, reader: jspb.BinaryReader): MessageServerData;
}

export namespace MessageServerData {
  export type AsObject = {
    opened: boolean,
    replied: boolean,
    depositData?: DepositData.AsObject,
    signature: Uint8Array | string,
  }
}

export class DepositData extends jspb.Message {
  getVerifyAttempts(): number;
  setVerifyAttempts(value: number): void;

  getLastVerifyAttempt(): number;
  setLastVerifyAttempt(value: number): void;

  hasDepositConfirmation(): boolean;
  clearDepositConfirmation(): void;
  getDepositConfirmation(): types_types_pb.DepositConfirmation | undefined;
  setDepositConfirmation(value?: types_types_pb.DepositConfirmation): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DepositData.AsObject;
  static toObject(includeInstance: boolean, msg: DepositData): DepositData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DepositData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DepositData;
  static deserializeBinaryFromReader(message: DepositData, reader: jspb.BinaryReader): DepositData;
}

export namespace DepositData {
  export type AsObject = {
    verifyAttempts: number,
    lastVerifyAttempt: number,
    depositConfirmation?: types_types_pb.DepositConfirmation.AsObject,
  }
}

export class Thread extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  clearMsgsIdsList(): void;
  getMsgsIdsList(): Array<Uint8Array | string>;
  getMsgsIdsList_asU8(): Array<Uint8Array>;
  getMsgsIdsList_asB64(): Array<string>;
  setMsgsIdsList(value: Array<Uint8Array | string>): void;
  addMsgsIds(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Thread.AsObject;
  static toObject(includeInstance: boolean, msg: Thread): Thread.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Thread, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Thread;
  static deserializeBinaryFromReader(message: Thread, reader: jspb.BinaryReader): Thread;
}

export namespace Thread {
  export type AsObject = {
    id: Uint8Array | string,
    msgsIdsList: Array<Uint8Array | string>,
  }
}

export class ThreadBox extends jspb.Message {
  getThreadBoxType(): ThreadBoxTypeMap[keyof ThreadBoxTypeMap];
  setThreadBoxType(value: ThreadBoxTypeMap[keyof ThreadBoxTypeMap]): void;

  clearThreadIdsList(): void;
  getThreadIdsList(): Array<Uint8Array | string>;
  getThreadIdsList_asU8(): Array<Uint8Array>;
  getThreadIdsList_asB64(): Array<string>;
  setThreadIdsList(value: Array<Uint8Array | string>): void;
  addThreadIds(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ThreadBox.AsObject;
  static toObject(includeInstance: boolean, msg: ThreadBox): ThreadBox.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ThreadBox, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ThreadBox;
  static deserializeBinaryFromReader(message: ThreadBox, reader: jspb.BinaryReader): ThreadBox;
}

export namespace ThreadBox {
  export type AsObject = {
    threadBoxType: ThreadBoxTypeMap[keyof ThreadBoxTypeMap],
    threadIdsList: Array<Uint8Array | string>,
  }
}

export class MessageContent extends jspb.Message {
  hasSubject(): boolean;
  clearSubject(): void;
  getSubject(): ContentItem | undefined;
  setSubject(value?: ContentItem): void;

  hasBody(): boolean;
  clearBody(): void;
  getBody(): ContentItem | undefined;
  setBody(value?: ContentItem): void;

  clearMediaItemsList(): void;
  getMediaItemsList(): Array<ContentItem>;
  setMediaItemsList(value: Array<ContentItem>): void;
  addMediaItems(value?: ContentItem, index?: number): ContentItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageContent.AsObject;
  static toObject(includeInstance: boolean, msg: MessageContent): MessageContent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MessageContent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageContent;
  static deserializeBinaryFromReader(message: MessageContent, reader: jspb.BinaryReader): MessageContent;
}

export namespace MessageContent {
  export type AsObject = {
    subject?: ContentItem.AsObject,
    body?: ContentItem.AsObject,
    mediaItemsList: Array<ContentItem.AsObject>,
  }
}

export class ContentItem extends jspb.Message {
  getMimeType(): types_types_pb.MimeTypeMap[keyof types_types_pb.MimeTypeMap];
  setMimeType(value: types_types_pb.MimeTypeMap[keyof types_types_pb.MimeTypeMap]): void;

  getCompression(): types_types_pb.CompressionMap[keyof types_types_pb.CompressionMap];
  setCompression(value: types_types_pb.CompressionMap[keyof types_types_pb.CompressionMap]): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContentItem.AsObject;
  static toObject(includeInstance: boolean, msg: ContentItem): ContentItem.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ContentItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContentItem;
  static deserializeBinaryFromReader(message: ContentItem, reader: jspb.BinaryReader): ContentItem;
}

export namespace ContentItem {
  export type AsObject = {
    mimeType: types_types_pb.MimeTypeMap[keyof types_types_pb.MimeTypeMap],
    compression: types_types_pb.CompressionMap[keyof types_types_pb.CompressionMap],
    data: Uint8Array | string,
  }
}

export interface ThreadBoxTypeMap {
  THREAD_BOX_TYPE_UNKNOWN: 0;
  THREAD_BOX_TYPE_INBOX: 1;
  THREAD_BOX_TYPE_SENT: 2;
  THREAD_BOX_TYPE_ARCHIVE: 4;
}

export const ThreadBoxType: ThreadBoxTypeMap;

