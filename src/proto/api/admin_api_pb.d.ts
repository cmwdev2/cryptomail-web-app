// package: api
// file: api/admin_api.proto

import * as jspb from "google-protobuf";
import * as api_api_types_pb from "../api/api_types_pb";
import * as types_accounts_pb from "../types/accounts_pb";
import * as types_content_pb from "../types/content_pb";
import * as types_types_pb from "../types/types_pb";

export class GetAccountsRequest extends jspb.Message {
  getFrom(): string;
  setFrom(value: string): void;

  getMaxResults(): number;
  setMaxResults(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountsRequest): GetAccountsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountsRequest;
  static deserializeBinaryFromReader(message: GetAccountsRequest, reader: jspb.BinaryReader): GetAccountsRequest;
}

export namespace GetAccountsRequest {
  export type AsObject = {
    from: string,
    maxResults: number,
  }
}

export class GetAccountsResponse extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): void;

  clearAccountsList(): void;
  getAccountsList(): Array<types_accounts_pb.Account>;
  setAccountsList(value: Array<types_accounts_pb.Account>): void;
  addAccounts(value?: types_accounts_pb.Account, index?: number): types_accounts_pb.Account;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountsResponse): GetAccountsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountsResponse;
  static deserializeBinaryFromReader(message: GetAccountsResponse, reader: jspb.BinaryReader): GetAccountsResponse;
}

export namespace GetAccountsResponse {
  export type AsObject = {
    total: number,
    accountsList: Array<types_accounts_pb.Account.AsObject>,
  }
}

export class GetAccountDataRequest extends jspb.Message {
  hasPublicKey(): boolean;
  clearPublicKey(): void;
  getPublicKey(): types_types_pb.PublicKey | undefined;
  setPublicKey(value?: types_types_pb.PublicKey): void;

  hasName(): boolean;
  clearName(): void;
  getName(): string;
  setName(value: string): void;

  getDataCase(): GetAccountDataRequest.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountDataRequest): GetAccountDataRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountDataRequest;
  static deserializeBinaryFromReader(message: GetAccountDataRequest, reader: jspb.BinaryReader): GetAccountDataRequest;
}

export namespace GetAccountDataRequest {
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

export class GetAccountDataResponse extends jspb.Message {
  hasAccount(): boolean;
  clearAccount(): void;
  getAccount(): types_accounts_pb.Account | undefined;
  setAccount(value?: types_accounts_pb.Account): void;

  clearThreadBoxesList(): void;
  getThreadBoxesList(): Array<types_content_pb.ThreadBox>;
  setThreadBoxesList(value: Array<types_content_pb.ThreadBox>): void;
  addThreadBoxes(value?: types_content_pb.ThreadBox, index?: number): types_content_pb.ThreadBox;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountDataResponse): GetAccountDataResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountDataResponse;
  static deserializeBinaryFromReader(message: GetAccountDataResponse, reader: jspb.BinaryReader): GetAccountDataResponse;
}

export namespace GetAccountDataResponse {
  export type AsObject = {
    account?: types_accounts_pb.Account.AsObject,
    threadBoxesList: Array<types_content_pb.ThreadBox.AsObject>,
  }
}

