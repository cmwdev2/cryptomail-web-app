// package: api
// file: api/api_types.proto

import * as jspb from "google-protobuf";
import * as types_types_pb from "../types/types_pb";
import * as types_content_pb from "../types/content_pb";
import * as types_accounts_pb from "../types/accounts_pb";

export class GetNewThreadIdRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNewThreadIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNewThreadIdRequest): GetNewThreadIdRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNewThreadIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNewThreadIdRequest;
  static deserializeBinaryFromReader(message: GetNewThreadIdRequest, reader: jspb.BinaryReader): GetNewThreadIdRequest;
}

export namespace GetNewThreadIdRequest {
  export type AsObject = {
  }
}

export class GetNewThreadIdResponse extends jspb.Message {
  getThreadId(): number;
  setThreadId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNewThreadIdResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetNewThreadIdResponse): GetNewThreadIdResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNewThreadIdResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNewThreadIdResponse;
  static deserializeBinaryFromReader(message: GetNewThreadIdResponse, reader: jspb.BinaryReader): GetNewThreadIdResponse;
}

export namespace GetNewThreadIdResponse {
  export type AsObject = {
    threadId: number,
  }
}

export class CreateAccountRequest extends jspb.Message {
  getTimeStamp(): number;
  setTimeStamp(value: number): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  hasSettings(): boolean;
  clearSettings(): void;
  getSettings(): types_accounts_pb.Settings | undefined;
  setSettings(value?: types_accounts_pb.Settings): void;

  hasPublicAccountInfo(): boolean;
  clearPublicAccountInfo(): void;
  getPublicAccountInfo(): types_types_pb.PublicAccountInfo | undefined;
  setPublicAccountInfo(value?: types_types_pb.PublicAccountInfo): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAccountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAccountRequest): CreateAccountRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateAccountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAccountRequest;
  static deserializeBinaryFromReader(message: CreateAccountRequest, reader: jspb.BinaryReader): CreateAccountRequest;
}

export namespace CreateAccountRequest {
  export type AsObject = {
    timeStamp: number,
    publicKey?: types_types_pb.PublicKey.AsObject,
    settings?: types_accounts_pb.Settings.AsObject,
    publicAccountInfo?: types_types_pb.PublicAccountInfo.AsObject,
    signature: Uint8Array | string,
  }
}

export class CreateAccountResponse extends jspb.Message {
  getResult(): CreateAccountResultMap[keyof CreateAccountResultMap];
  setResult(value: CreateAccountResultMap[keyof CreateAccountResultMap]): void;

  hasAccount(): boolean;
  clearAccount(): void;
  getAccount(): types_accounts_pb.Account | undefined;
  setAccount(value?: types_accounts_pb.Account): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAccountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAccountResponse): CreateAccountResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateAccountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAccountResponse;
  static deserializeBinaryFromReader(message: CreateAccountResponse, reader: jspb.BinaryReader): CreateAccountResponse;
}

export namespace CreateAccountResponse {
  export type AsObject = {
    result: CreateAccountResultMap[keyof CreateAccountResultMap],
    account?: types_accounts_pb.Account.AsObject,
  }
}

export class GetThreadBoxesRequest extends jspb.Message {
  getTimeStamp(): number;
  setTimeStamp(value: number): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  getThreadBoxes(): number;
  setThreadBoxes(value: number): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetThreadBoxesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetThreadBoxesRequest): GetThreadBoxesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetThreadBoxesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetThreadBoxesRequest;
  static deserializeBinaryFromReader(message: GetThreadBoxesRequest, reader: jspb.BinaryReader): GetThreadBoxesRequest;
}

export namespace GetThreadBoxesRequest {
  export type AsObject = {
    timeStamp: number,
    publicKey?: types_types_pb.PublicKey.AsObject,
    threadBoxes: number,
    signature: Uint8Array | string,
  }
}

export class GetThreadBoxesResponse extends jspb.Message {
  hasAccount(): boolean;
  clearAccount(): void;
  getAccount(): types_accounts_pb.Account | undefined;
  setAccount(value?: types_accounts_pb.Account): void;

  clearThreadsBoxesList(): void;
  getThreadsBoxesList(): Array<types_content_pb.ThreadBox>;
  setThreadsBoxesList(value: Array<types_content_pb.ThreadBox>): void;
  addThreadsBoxes(value?: types_content_pb.ThreadBox, index?: number): types_content_pb.ThreadBox;

  clearMessagesList(): void;
  getMessagesList(): Array<types_content_pb.Message>;
  setMessagesList(value: Array<types_content_pb.Message>): void;
  addMessages(value?: types_content_pb.Message, index?: number): types_content_pb.Message;

  clearAccountsList(): void;
  getAccountsList(): Array<types_accounts_pb.Account>;
  setAccountsList(value: Array<types_accounts_pb.Account>): void;
  addAccounts(value?: types_accounts_pb.Account, index?: number): types_accounts_pb.Account;

  clearThreadsList(): void;
  getThreadsList(): Array<types_content_pb.Thread>;
  setThreadsList(value: Array<types_content_pb.Thread>): void;
  addThreads(value?: types_content_pb.Thread, index?: number): types_content_pb.Thread;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetThreadBoxesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetThreadBoxesResponse): GetThreadBoxesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetThreadBoxesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetThreadBoxesResponse;
  static deserializeBinaryFromReader(message: GetThreadBoxesResponse, reader: jspb.BinaryReader): GetThreadBoxesResponse;
}

export namespace GetThreadBoxesResponse {
  export type AsObject = {
    account?: types_accounts_pb.Account.AsObject,
    threadsBoxesList: Array<types_content_pb.ThreadBox.AsObject>,
    messagesList: Array<types_content_pb.Message.AsObject>,
    accountsList: Array<types_accounts_pb.Account.AsObject>,
    threadsList: Array<types_content_pb.Thread.AsObject>,
  }
}

export class NewThreadRequest extends jspb.Message {
  getTimeStamp(): number;
  setTimeStamp(value: number): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  getMessageUserData(): Uint8Array | string;
  getMessageUserData_asU8(): Uint8Array;
  getMessageUserData_asB64(): string;
  setMessageUserData(value: Uint8Array | string): void;

  getMessageUserDataSignature(): Uint8Array | string;
  getMessageUserDataSignature_asU8(): Uint8Array;
  getMessageUserDataSignature_asB64(): string;
  setMessageUserDataSignature(value: Uint8Array | string): void;

  hasMessageId(): boolean;
  clearMessageId(): void;
  getMessageId(): types_types_pb.MessageId | undefined;
  setMessageId(value?: types_types_pb.MessageId): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NewThreadRequest.AsObject;
  static toObject(includeInstance: boolean, msg: NewThreadRequest): NewThreadRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NewThreadRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NewThreadRequest;
  static deserializeBinaryFromReader(message: NewThreadRequest, reader: jspb.BinaryReader): NewThreadRequest;
}

export namespace NewThreadRequest {
  export type AsObject = {
    timeStamp: number,
    publicKey?: types_types_pb.PublicKey.AsObject,
    messageUserData: Uint8Array | string,
    messageUserDataSignature: Uint8Array | string,
    messageId?: types_types_pb.MessageId.AsObject,
    signature: Uint8Array | string,
  }
}

export class NewThreadResponse extends jspb.Message {
  getResult(): NewThreadResultMap[keyof NewThreadResultMap];
  setResult(value: NewThreadResultMap[keyof NewThreadResultMap]): void;

  hasMessageId(): boolean;
  clearMessageId(): void;
  getMessageId(): types_types_pb.MessageId | undefined;
  setMessageId(value?: types_types_pb.MessageId): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NewThreadResponse.AsObject;
  static toObject(includeInstance: boolean, msg: NewThreadResponse): NewThreadResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NewThreadResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NewThreadResponse;
  static deserializeBinaryFromReader(message: NewThreadResponse, reader: jspb.BinaryReader): NewThreadResponse;
}

export namespace NewThreadResponse {
  export type AsObject = {
    result: NewThreadResultMap[keyof NewThreadResultMap],
    messageId?: types_types_pb.MessageId.AsObject,
  }
}

export class OpenMessageRequest extends jspb.Message {
  getTimeStamp(): number;
  setTimeStamp(value: number): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  hasMessageId(): boolean;
  clearMessageId(): void;
  getMessageId(): types_types_pb.MessageId | undefined;
  setMessageId(value?: types_types_pb.MessageId): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OpenMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: OpenMessageRequest): OpenMessageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OpenMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OpenMessageRequest;
  static deserializeBinaryFromReader(message: OpenMessageRequest, reader: jspb.BinaryReader): OpenMessageRequest;
}

export namespace OpenMessageRequest {
  export type AsObject = {
    timeStamp: number,
    publicKey?: types_types_pb.PublicKey.AsObject,
    messageId?: types_types_pb.MessageId.AsObject,
    signature: Uint8Array | string,
  }
}

export class OpenMessageResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OpenMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: OpenMessageResponse): OpenMessageResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OpenMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OpenMessageResponse;
  static deserializeBinaryFromReader(message: OpenMessageResponse, reader: jspb.BinaryReader): OpenMessageResponse;
}

export namespace OpenMessageResponse {
  export type AsObject = {
  }
}

export class ReplyRequest extends jspb.Message {
  getTimeStamp(): number;
  setTimeStamp(value: number): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  getMessageUserData(): Uint8Array | string;
  getMessageUserData_asU8(): Uint8Array;
  getMessageUserData_asB64(): string;
  setMessageUserData(value: Uint8Array | string): void;

  getMessageUserDataSignature(): Uint8Array | string;
  getMessageUserDataSignature_asU8(): Uint8Array;
  getMessageUserDataSignature_asB64(): string;
  setMessageUserDataSignature(value: Uint8Array | string): void;

  hasMessageId(): boolean;
  clearMessageId(): void;
  getMessageId(): types_types_pb.MessageId | undefined;
  setMessageId(value?: types_types_pb.MessageId): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ReplyRequest): ReplyRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReplyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplyRequest;
  static deserializeBinaryFromReader(message: ReplyRequest, reader: jspb.BinaryReader): ReplyRequest;
}

export namespace ReplyRequest {
  export type AsObject = {
    timeStamp: number,
    publicKey?: types_types_pb.PublicKey.AsObject,
    messageUserData: Uint8Array | string,
    messageUserDataSignature: Uint8Array | string,
    messageId?: types_types_pb.MessageId.AsObject,
    signature: Uint8Array | string,
  }
}

export class ReplyResponse extends jspb.Message {
  hasMessageId(): boolean;
  clearMessageId(): void;
  getMessageId(): types_types_pb.MessageId | undefined;
  setMessageId(value?: types_types_pb.MessageId): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReplyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ReplyResponse): ReplyResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReplyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReplyResponse;
  static deserializeBinaryFromReader(message: ReplyResponse, reader: jspb.BinaryReader): ReplyResponse;
}

export namespace ReplyResponse {
  export type AsObject = {
    messageId?: types_types_pb.MessageId.AsObject,
  }
}

export class ArchiveThreadRequest extends jspb.Message {
  getTimeStamp(): number;
  setTimeStamp(value: number): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  getThreadId(): Uint8Array | string;
  getThreadId_asU8(): Uint8Array;
  getThreadId_asB64(): string;
  setThreadId(value: Uint8Array | string): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ArchiveThreadRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ArchiveThreadRequest): ArchiveThreadRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ArchiveThreadRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ArchiveThreadRequest;
  static deserializeBinaryFromReader(message: ArchiveThreadRequest, reader: jspb.BinaryReader): ArchiveThreadRequest;
}

export namespace ArchiveThreadRequest {
  export type AsObject = {
    timeStamp: number,
    publicKey?: types_types_pb.PublicKey.AsObject,
    threadId: Uint8Array | string,
    signature: Uint8Array | string,
  }
}

export class ArchiveThreadResponse extends jspb.Message {
  hasThreadId(): boolean;
  clearThreadId(): void;
  getThreadId(): types_types_pb.ThreadId | undefined;
  setThreadId(value?: types_types_pb.ThreadId): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ArchiveThreadResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ArchiveThreadResponse): ArchiveThreadResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ArchiveThreadResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ArchiveThreadResponse;
  static deserializeBinaryFromReader(message: ArchiveThreadResponse, reader: jspb.BinaryReader): ArchiveThreadResponse;
}

export namespace ArchiveThreadResponse {
  export type AsObject = {
    threadId?: types_types_pb.ThreadId.AsObject,
  }
}

export class DeleteThreadRequest extends jspb.Message {
  getTimeStamp(): number;
  setTimeStamp(value: number): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  getThreadId(): Uint8Array | string;
  getThreadId_asU8(): Uint8Array;
  getThreadId_asB64(): string;
  setThreadId(value: Uint8Array | string): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteThreadRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteThreadRequest): DeleteThreadRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteThreadRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteThreadRequest;
  static deserializeBinaryFromReader(message: DeleteThreadRequest, reader: jspb.BinaryReader): DeleteThreadRequest;
}

export namespace DeleteThreadRequest {
  export type AsObject = {
    timeStamp: number,
    publicKey?: types_types_pb.PublicKey.AsObject,
    threadId: Uint8Array | string,
    signature: Uint8Array | string,
  }
}

export class DeleteThreadResponse extends jspb.Message {
  hasThreadId(): boolean;
  clearThreadId(): void;
  getThreadId(): types_types_pb.ThreadId | undefined;
  setThreadId(value?: types_types_pb.ThreadId): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteThreadResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteThreadResponse): DeleteThreadResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteThreadResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteThreadResponse;
  static deserializeBinaryFromReader(message: DeleteThreadResponse, reader: jspb.BinaryReader): DeleteThreadResponse;
}

export namespace DeleteThreadResponse {
  export type AsObject = {
    threadId?: types_types_pb.ThreadId.AsObject,
  }
}

export class UpdateSettingsRequest extends jspb.Message {
  getTimeStamp(): number;
  setTimeStamp(value: number): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  hasSettings(): boolean;
  clearSettings(): void;
  getSettings(): types_accounts_pb.Settings | undefined;
  setSettings(value?: types_accounts_pb.Settings): void;

  hasPublicAccountInfo(): boolean;
  clearPublicAccountInfo(): void;
  getPublicAccountInfo(): types_types_pb.PublicAccountInfo | undefined;
  setPublicAccountInfo(value?: types_types_pb.PublicAccountInfo): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateSettingsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateSettingsRequest): UpdateSettingsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateSettingsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateSettingsRequest;
  static deserializeBinaryFromReader(message: UpdateSettingsRequest, reader: jspb.BinaryReader): UpdateSettingsRequest;
}

export namespace UpdateSettingsRequest {
  export type AsObject = {
    timeStamp: number,
    publicKey?: types_types_pb.PublicKey.AsObject,
    settings?: types_accounts_pb.Settings.AsObject,
    publicAccountInfo?: types_types_pb.PublicAccountInfo.AsObject,
    signature: Uint8Array | string,
  }
}

export class UpdateSettingsResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateSettingsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateSettingsResponse): UpdateSettingsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateSettingsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateSettingsResponse;
  static deserializeBinaryFromReader(message: UpdateSettingsResponse, reader: jspb.BinaryReader): UpdateSettingsResponse;
}

export namespace UpdateSettingsResponse {
  export type AsObject = {
  }
}

export class DeleteAccountRequest extends jspb.Message {
  getTimeStamp(): number;
  setTimeStamp(value: number): void;

  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteAccountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteAccountRequest): DeleteAccountRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteAccountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteAccountRequest;
  static deserializeBinaryFromReader(message: DeleteAccountRequest, reader: jspb.BinaryReader): DeleteAccountRequest;
}

export namespace DeleteAccountRequest {
  export type AsObject = {
    timeStamp: number,
    publicKey?: types_types_pb.PublicKey.AsObject,
    signature: Uint8Array | string,
  }
}

export class DeleteAccountResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteAccountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteAccountResponse): DeleteAccountResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteAccountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteAccountResponse;
  static deserializeBinaryFromReader(message: DeleteAccountResponse, reader: jspb.BinaryReader): DeleteAccountResponse;
}

export namespace DeleteAccountResponse {
  export type AsObject = {
  }
}

export class GetAccountRequest extends jspb.Message {
  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  hasName(): boolean;
  clearName(): void;
  getName(): string;
  setName(value: string): void;

  getDataCase(): GetAccountRequest.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountRequest): GetAccountRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountRequest;
  static deserializeBinaryFromReader(message: GetAccountRequest, reader: jspb.BinaryReader): GetAccountRequest;
}

export namespace GetAccountRequest {
  export type AsObject = {
    publicKey?: types_types_pb.PublicKey.AsObject,
    name: string,
  }

  export enum DataCase {
    DATA_NOT_SET = 0,
    PUBLIC_KEY = 1,
    NAME = 2,
  }
}

export class GetAccountResponse extends jspb.Message {
  hasAccount(): boolean;
  clearAccount(): void;
  getAccount(): types_accounts_pb.Account | undefined;
  setAccount(value?: types_accounts_pb.Account): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountResponse): GetAccountResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountResponse;
  static deserializeBinaryFromReader(message: GetAccountResponse, reader: jspb.BinaryReader): GetAccountResponse;
}

export namespace GetAccountResponse {
  export type AsObject = {
    account?: types_accounts_pb.Account.AsObject,
  }
}

export class GetPublicAccountsRequest extends jspb.Message {
  getFrom(): string;
  setFrom(value: string): void;

  getMaxResults(): number;
  setMaxResults(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPublicAccountsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPublicAccountsRequest): GetPublicAccountsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPublicAccountsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPublicAccountsRequest;
  static deserializeBinaryFromReader(message: GetPublicAccountsRequest, reader: jspb.BinaryReader): GetPublicAccountsRequest;
}

export namespace GetPublicAccountsRequest {
  export type AsObject = {
    from: string,
    maxResults: number,
  }
}

export class GetPublicAccountsResponse extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): void;

  clearAccountsList(): void;
  getAccountsList(): Array<types_accounts_pb.Account>;
  setAccountsList(value: Array<types_accounts_pb.Account>): void;
  addAccounts(value?: types_accounts_pb.Account, index?: number): types_accounts_pb.Account;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPublicAccountsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPublicAccountsResponse): GetPublicAccountsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPublicAccountsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPublicAccountsResponse;
  static deserializeBinaryFromReader(message: GetPublicAccountsResponse, reader: jspb.BinaryReader): GetPublicAccountsResponse;
}

export namespace GetPublicAccountsResponse {
  export type AsObject = {
    total: number,
    accountsList: Array<types_accounts_pb.Account.AsObject>,
  }
}

export class GetMessageDepositDataRequest extends jspb.Message {
  hasMessageId(): boolean;
  clearMessageId(): void;
  getMessageId(): types_types_pb.MessageId | undefined;
  setMessageId(value?: types_types_pb.MessageId): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMessageDepositDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMessageDepositDataRequest): GetMessageDepositDataRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMessageDepositDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMessageDepositDataRequest;
  static deserializeBinaryFromReader(message: GetMessageDepositDataRequest, reader: jspb.BinaryReader): GetMessageDepositDataRequest;
}

export namespace GetMessageDepositDataRequest {
  export type AsObject = {
    messageId?: types_types_pb.MessageId.AsObject,
  }
}

export class GetMessageDepositDataResponse extends jspb.Message {
  hasDepositConfirmation(): boolean;
  clearDepositConfirmation(): void;
  getDepositConfirmation(): types_types_pb.DepositConfirmation | undefined;
  setDepositConfirmation(value?: types_types_pb.DepositConfirmation): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMessageDepositDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMessageDepositDataResponse): GetMessageDepositDataResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMessageDepositDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMessageDepositDataResponse;
  static deserializeBinaryFromReader(message: GetMessageDepositDataResponse, reader: jspb.BinaryReader): GetMessageDepositDataResponse;
}

export namespace GetMessageDepositDataResponse {
  export type AsObject = {
    depositConfirmation?: types_types_pb.DepositConfirmation.AsObject,
  }
}

export class GetCoinPriceRequest extends jspb.Message {
  getSymbol(): string;
  setSymbol(value: string): void;

  clearCurrenciesList(): void;
  getCurrenciesList(): Array<string>;
  setCurrenciesList(value: Array<string>): void;
  addCurrencies(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCoinPriceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCoinPriceRequest): GetCoinPriceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCoinPriceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCoinPriceRequest;
  static deserializeBinaryFromReader(message: GetCoinPriceRequest, reader: jspb.BinaryReader): GetCoinPriceRequest;
}

export namespace GetCoinPriceRequest {
  export type AsObject = {
    symbol: string,
    currenciesList: Array<string>,
  }
}

export class FiatCoinPrice extends jspb.Message {
  getCurrency(): string;
  setCurrency(value: string): void;

  getPrice(): number;
  setPrice(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FiatCoinPrice.AsObject;
  static toObject(includeInstance: boolean, msg: FiatCoinPrice): FiatCoinPrice.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FiatCoinPrice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FiatCoinPrice;
  static deserializeBinaryFromReader(message: FiatCoinPrice, reader: jspb.BinaryReader): FiatCoinPrice;
}

export namespace FiatCoinPrice {
  export type AsObject = {
    currency: string,
    price: number,
  }
}

export class GetCoinPriceResponse extends jspb.Message {
  clearPricesList(): void;
  getPricesList(): Array<FiatCoinPrice>;
  setPricesList(value: Array<FiatCoinPrice>): void;
  addPrices(value?: FiatCoinPrice, index?: number): FiatCoinPrice;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCoinPriceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCoinPriceResponse): GetCoinPriceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCoinPriceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCoinPriceResponse;
  static deserializeBinaryFromReader(message: GetCoinPriceResponse, reader: jspb.BinaryReader): GetCoinPriceResponse;
}

export namespace GetCoinPriceResponse {
  export type AsObject = {
    pricesList: Array<FiatCoinPrice.AsObject>,
  }
}

export interface CreateAccountResultMap {
  CREATE_ACCOUNT_RESULT_CREATED: 0;
  CREATE_ACCOUNT_RESULT_EXISTS: 1;
  CREATE_ACCOUNT_RESULT_NAME_TAKEN: 2;
}

export const CreateAccountResult: CreateAccountResultMap;

export interface NewThreadResultMap {
  NEW_THREAD_RESULT_CREATED: 0;
  NEW_THREAD_RESULT_INVALID_THREAD_ID: 1;
  NEW_THREAD_RESULT_INVALID_SIG: 2;
  NEW_THREAD_RESULT_MISSING_DATA: 3;
  NEW_THREAD_RESULT_INVALID_TX: 4;
  NEW_THREAD_RESULT_INVALID_TIME_STAMP: 5;
  NEW_THREAD_RESULT_INVALID_SENDER_ACCOUNT: 6;
  NEW_THREAD_RESULT_INVALID_RECEIVER_ACCOUNT: 7;
}

export const NewThreadResult: NewThreadResultMap;

