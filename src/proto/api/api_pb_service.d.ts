// package: api
// file: api/api.proto

import * as api_api_pb from "../api/api_pb";
import * as api_api_types_pb from "../api/api_types_pb";
import {grpc} from "@improbable-eng/grpc-web";

type CryptomailApiServiceCreateAccount = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.CreateAccountRequest;
  readonly responseType: typeof api_api_types_pb.CreateAccountResponse;
};

type CryptomailApiServiceUpdateSettings = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.UpdateSettingsRequest;
  readonly responseType: typeof api_api_types_pb.UpdateSettingsResponse;
};

type CryptomailApiServiceDeleteAccount = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.DeleteAccountRequest;
  readonly responseType: typeof api_api_types_pb.DeleteAccountResponse;
};

type CryptomailApiServiceGetThreadBoxes = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.GetThreadBoxesRequest;
  readonly responseType: typeof api_api_types_pb.GetThreadBoxesResponse;
};

type CryptomailApiServiceOpenMessage = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.OpenMessageRequest;
  readonly responseType: typeof api_api_types_pb.OpenMessageResponse;
};

type CryptomailApiServiceReply = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.ReplyRequest;
  readonly responseType: typeof api_api_types_pb.ReplyResponse;
};

type CryptomailApiServiceArchiveThread = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.ArchiveThreadRequest;
  readonly responseType: typeof api_api_types_pb.ArchiveThreadResponse;
};

type CryptomailApiServiceDeleteThread = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.DeleteThreadRequest;
  readonly responseType: typeof api_api_types_pb.DeleteThreadResponse;
};

type CryptomailApiServiceNewThread = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.NewThreadRequest;
  readonly responseType: typeof api_api_types_pb.NewThreadResponse;
};

type CryptomailApiServiceGetAccount = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.GetAccountRequest;
  readonly responseType: typeof api_api_types_pb.GetAccountResponse;
};

type CryptomailApiServiceGetPublicAccounts = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.GetPublicAccountsRequest;
  readonly responseType: typeof api_api_types_pb.GetPublicAccountsResponse;
};

type CryptomailApiServiceGetMessageDepositData = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.GetMessageDepositDataRequest;
  readonly responseType: typeof api_api_types_pb.GetMessageDepositDataResponse;
};

type CryptomailApiServiceGetCoinPrice = {
  readonly methodName: string;
  readonly service: typeof CryptomailApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_api_types_pb.GetCoinPriceRequest;
  readonly responseType: typeof api_api_types_pb.GetCoinPriceResponse;
};

export class CryptomailApiService {
  static readonly serviceName: string;
  static readonly CreateAccount: CryptomailApiServiceCreateAccount;
  static readonly UpdateSettings: CryptomailApiServiceUpdateSettings;
  static readonly DeleteAccount: CryptomailApiServiceDeleteAccount;
  static readonly GetThreadBoxes: CryptomailApiServiceGetThreadBoxes;
  static readonly OpenMessage: CryptomailApiServiceOpenMessage;
  static readonly Reply: CryptomailApiServiceReply;
  static readonly ArchiveThread: CryptomailApiServiceArchiveThread;
  static readonly DeleteThread: CryptomailApiServiceDeleteThread;
  static readonly NewThread: CryptomailApiServiceNewThread;
  static readonly GetAccount: CryptomailApiServiceGetAccount;
  static readonly GetPublicAccounts: CryptomailApiServiceGetPublicAccounts;
  static readonly GetMessageDepositData: CryptomailApiServiceGetMessageDepositData;
  static readonly GetCoinPrice: CryptomailApiServiceGetCoinPrice;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class CryptomailApiServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  createAccount(
    requestMessage: api_api_types_pb.CreateAccountRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.CreateAccountResponse|null) => void
  ): UnaryResponse;
  createAccount(
    requestMessage: api_api_types_pb.CreateAccountRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.CreateAccountResponse|null) => void
  ): UnaryResponse;
  updateSettings(
    requestMessage: api_api_types_pb.UpdateSettingsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.UpdateSettingsResponse|null) => void
  ): UnaryResponse;
  updateSettings(
    requestMessage: api_api_types_pb.UpdateSettingsRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.UpdateSettingsResponse|null) => void
  ): UnaryResponse;
  deleteAccount(
    requestMessage: api_api_types_pb.DeleteAccountRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.DeleteAccountResponse|null) => void
  ): UnaryResponse;
  deleteAccount(
    requestMessage: api_api_types_pb.DeleteAccountRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.DeleteAccountResponse|null) => void
  ): UnaryResponse;
  getThreadBoxes(
    requestMessage: api_api_types_pb.GetThreadBoxesRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetThreadBoxesResponse|null) => void
  ): UnaryResponse;
  getThreadBoxes(
    requestMessage: api_api_types_pb.GetThreadBoxesRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetThreadBoxesResponse|null) => void
  ): UnaryResponse;
  openMessage(
    requestMessage: api_api_types_pb.OpenMessageRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.OpenMessageResponse|null) => void
  ): UnaryResponse;
  openMessage(
    requestMessage: api_api_types_pb.OpenMessageRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.OpenMessageResponse|null) => void
  ): UnaryResponse;
  reply(
    requestMessage: api_api_types_pb.ReplyRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.ReplyResponse|null) => void
  ): UnaryResponse;
  reply(
    requestMessage: api_api_types_pb.ReplyRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.ReplyResponse|null) => void
  ): UnaryResponse;
  archiveThread(
    requestMessage: api_api_types_pb.ArchiveThreadRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.ArchiveThreadResponse|null) => void
  ): UnaryResponse;
  archiveThread(
    requestMessage: api_api_types_pb.ArchiveThreadRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.ArchiveThreadResponse|null) => void
  ): UnaryResponse;
  deleteThread(
    requestMessage: api_api_types_pb.DeleteThreadRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.DeleteThreadResponse|null) => void
  ): UnaryResponse;
  deleteThread(
    requestMessage: api_api_types_pb.DeleteThreadRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.DeleteThreadResponse|null) => void
  ): UnaryResponse;
  newThread(
    requestMessage: api_api_types_pb.NewThreadRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.NewThreadResponse|null) => void
  ): UnaryResponse;
  newThread(
    requestMessage: api_api_types_pb.NewThreadRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.NewThreadResponse|null) => void
  ): UnaryResponse;
  getAccount(
    requestMessage: api_api_types_pb.GetAccountRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetAccountResponse|null) => void
  ): UnaryResponse;
  getAccount(
    requestMessage: api_api_types_pb.GetAccountRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetAccountResponse|null) => void
  ): UnaryResponse;
  getPublicAccounts(
    requestMessage: api_api_types_pb.GetPublicAccountsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetPublicAccountsResponse|null) => void
  ): UnaryResponse;
  getPublicAccounts(
    requestMessage: api_api_types_pb.GetPublicAccountsRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetPublicAccountsResponse|null) => void
  ): UnaryResponse;
  getMessageDepositData(
    requestMessage: api_api_types_pb.GetMessageDepositDataRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetMessageDepositDataResponse|null) => void
  ): UnaryResponse;
  getMessageDepositData(
    requestMessage: api_api_types_pb.GetMessageDepositDataRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetMessageDepositDataResponse|null) => void
  ): UnaryResponse;
  getCoinPrice(
    requestMessage: api_api_types_pb.GetCoinPriceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetCoinPriceResponse|null) => void
  ): UnaryResponse;
  getCoinPrice(
    requestMessage: api_api_types_pb.GetCoinPriceRequest,
    callback: (error: ServiceError|null, responseMessage: api_api_types_pb.GetCoinPriceResponse|null) => void
  ): UnaryResponse;
}

