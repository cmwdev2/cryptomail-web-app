// package: types
// file: types/accounts.proto

import * as jspb from "google-protobuf";
import * as types_types_pb from "../types/types_pb";

export class Account extends jspb.Message {
  hasIdPubKey(): boolean;
  clearIdPubKey(): void;
  getIdPubKey(): types_types_pb.PublicKey | undefined;
  setIdPubKey(value?: types_types_pb.PublicKey): void;

  hasReputation(): boolean;
  clearReputation(): void;
  getReputation(): Reputation | undefined;
  setReputation(value?: Reputation): void;

  getTimeCreated(): number;
  setTimeCreated(value: number): void;

  getTimeLastLogin(): number;
  setTimeLastLogin(value: number): void;

  hasSettings(): boolean;
  clearSettings(): void;
  getSettings(): Settings | undefined;
  setSettings(value?: Settings): void;

  hasPublicAccountInfo(): boolean;
  clearPublicAccountInfo(): void;
  getPublicAccountInfo(): types_types_pb.PublicAccountInfo | undefined;
  setPublicAccountInfo(value?: types_types_pb.PublicAccountInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Account.AsObject;
  static toObject(includeInstance: boolean, msg: Account): Account.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Account, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Account;
  static deserializeBinaryFromReader(message: Account, reader: jspb.BinaryReader): Account;
}

export namespace Account {
  export type AsObject = {
    idPubKey?: types_types_pb.PublicKey.AsObject,
    reputation?: Reputation.AsObject,
    timeCreated: number,
    timeLastLogin: number,
    settings?: Settings.AsObject,
    publicAccountInfo?: types_types_pb.PublicAccountInfo.AsObject,
  }
}

export class Settings extends jspb.Message {
  getPublicListAccount(): boolean;
  setPublicListAccount(value: boolean): void;

  getDisplayArtBackground(): boolean;
  setDisplayArtBackground(value: boolean): void;

  getActive(): boolean;
  setActive(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Settings.AsObject;
  static toObject(includeInstance: boolean, msg: Settings): Settings.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Settings, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Settings;
  static deserializeBinaryFromReader(message: Settings, reader: jspb.BinaryReader): Settings;
}

export namespace Settings {
  export type AsObject = {
    publicListAccount: boolean,
    displayArtBackground: boolean,
    active: boolean,
  }
}

export class Reputation extends jspb.Message {
  getOpenPaidMessagesReceived(): number;
  setOpenPaidMessagesReceived(value: number): void;

  getOpenPaidMessageOpened(): number;
  setOpenPaidMessageOpened(value: number): void;

  getMessagesReplyPaidReceived(): number;
  setMessagesReplyPaidReceived(value: number): void;

  getMessagesReplyPaidOpened(): number;
  setMessagesReplyPaidOpened(value: number): void;

  getPaymentRedeemedNoOpen(): number;
  setPaymentRedeemedNoOpen(value: number): void;

  getPaymentRedeemedNoReply(): number;
  setPaymentRedeemedNoReply(value: number): void;

  getReputationScore(): number;
  setReputationScore(value: number): void;

  getOgRank(): number;
  setOgRank(value: number): void;

  getCmailTokenBalanceCurPeriod(): number;
  setCmailTokenBalanceCurPeriod(value: number): void;

  getLastDropCmailTokens(): number;
  setLastDropCmailTokens(value: number): void;

  getCmailTokenBalanceTotalEarned(): number;
  setCmailTokenBalanceTotalEarned(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Reputation.AsObject;
  static toObject(includeInstance: boolean, msg: Reputation): Reputation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Reputation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Reputation;
  static deserializeBinaryFromReader(message: Reputation, reader: jspb.BinaryReader): Reputation;
}

export namespace Reputation {
  export type AsObject = {
    openPaidMessagesReceived: number,
    openPaidMessageOpened: number,
    messagesReplyPaidReceived: number,
    messagesReplyPaidOpened: number,
    paymentRedeemedNoOpen: number,
    paymentRedeemedNoReply: number,
    reputationScore: number,
    ogRank: number,
    cmailTokenBalanceCurPeriod: number,
    lastDropCmailTokens: number,
    cmailTokenBalanceTotalEarned: number,
  }
}

