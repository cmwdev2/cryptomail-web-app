/* eslint-disable */
//@ts-nocheck
// package: api
// file: api/admin_api.proto

var api_admin_api_pb = require("../api/admin_api_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var CryptomailAdminApiService = (function () {
  function CryptomailAdminApiService() {}
  CryptomailAdminApiService.serviceName = "api.CryptomailAdminApiService";
  return CryptomailAdminApiService;
}());

CryptomailAdminApiService.GetAccounts = {
  methodName: "GetAccounts",
  service: CryptomailAdminApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_admin_api_pb.GetAccountsRequest,
  responseType: api_admin_api_pb.GetAccountsResponse
};

CryptomailAdminApiService.GetAccountData = {
  methodName: "GetAccountData",
  service: CryptomailAdminApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_admin_api_pb.GetAccountDataRequest,
  responseType: api_admin_api_pb.GetAccountDataResponse
};

exports.CryptomailAdminApiService = CryptomailAdminApiService;

function CryptomailAdminApiServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

CryptomailAdminApiServiceClient.prototype.getAccounts = function getAccounts(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailAdminApiService.GetAccounts, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

CryptomailAdminApiServiceClient.prototype.getAccountData = function getAccountData(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailAdminApiService.GetAccountData, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.CryptomailAdminApiServiceClient = CryptomailAdminApiServiceClient;

