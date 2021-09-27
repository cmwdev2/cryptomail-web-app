// package: api
// file: api/admin_api.proto

import * as api_admin_api_pb from "../api/admin_api_pb";
import {grpc} from "@improbable-eng/grpc-web";

type CryptomailAdminApiServiceGetAccounts = {
  readonly methodName: string;
  readonly service: typeof CryptomailAdminApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_admin_api_pb.GetAccountsRequest;
  readonly responseType: typeof api_admin_api_pb.GetAccountsResponse;
};

type CryptomailAdminApiServiceGetAccountData = {
  readonly methodName: string;
  readonly service: typeof CryptomailAdminApiService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof api_admin_api_pb.GetAccountDataRequest;
  readonly responseType: typeof api_admin_api_pb.GetAccountDataResponse;
};

export class CryptomailAdminApiService {
  static readonly serviceName: string;
  static readonly GetAccounts: CryptomailAdminApiServiceGetAccounts;
  static readonly GetAccountData: CryptomailAdminApiServiceGetAccountData;
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

export class CryptomailAdminApiServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getAccounts(
    requestMessage: api_admin_api_pb.GetAccountsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_admin_api_pb.GetAccountsResponse|null) => void
  ): UnaryResponse;
  getAccounts(
    requestMessage: api_admin_api_pb.GetAccountsRequest,
    callback: (error: ServiceError|null, responseMessage: api_admin_api_pb.GetAccountsResponse|null) => void
  ): UnaryResponse;
  getAccountData(
    requestMessage: api_admin_api_pb.GetAccountDataRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: api_admin_api_pb.GetAccountDataResponse|null) => void
  ): UnaryResponse;
  getAccountData(
    requestMessage: api_admin_api_pb.GetAccountDataRequest,
    callback: (error: ServiceError|null, responseMessage: api_admin_api_pb.GetAccountDataResponse|null) => void
  ): UnaryResponse;
}

