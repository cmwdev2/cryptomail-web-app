/* eslint-disable */
//@ts-nocheck
// package: api
// file: api/api.proto

var api_api_pb = require("../api/api_pb");
var api_api_types_pb = require("../api/api_types_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var CryptomailApiService = (function () {
  function CryptomailApiService() {}
  CryptomailApiService.serviceName = "api.CryptomailApiService";
  return CryptomailApiService;
}());

CryptomailApiService.CreateAccount = {
  methodName: "CreateAccount",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.CreateAccountRequest,
  responseType: api_api_types_pb.CreateAccountResponse
};

CryptomailApiService.UpdateSettings = {
  methodName: "UpdateSettings",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.UpdateSettingsRequest,
  responseType: api_api_types_pb.UpdateSettingsResponse
};

CryptomailApiService.DeleteAccount = {
  methodName: "DeleteAccount",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.DeleteAccountRequest,
  responseType: api_api_types_pb.DeleteAccountResponse
};

CryptomailApiService.GetThreadBoxes = {
  methodName: "GetThreadBoxes",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.GetThreadBoxesRequest,
  responseType: api_api_types_pb.GetThreadBoxesResponse
};

CryptomailApiService.OpenMessage = {
  methodName: "OpenMessage",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.OpenMessageRequest,
  responseType: api_api_types_pb.OpenMessageResponse
};

CryptomailApiService.Reply = {
  methodName: "Reply",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.ReplyRequest,
  responseType: api_api_types_pb.ReplyResponse
};

CryptomailApiService.ArchiveThread = {
  methodName: "ArchiveThread",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.ArchiveThreadRequest,
  responseType: api_api_types_pb.ArchiveThreadResponse
};

CryptomailApiService.DeleteThread = {
  methodName: "DeleteThread",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.DeleteThreadRequest,
  responseType: api_api_types_pb.DeleteThreadResponse
};

CryptomailApiService.NewThread = {
  methodName: "NewThread",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.NewThreadRequest,
  responseType: api_api_types_pb.NewThreadResponse
};

CryptomailApiService.GetAccount = {
  methodName: "GetAccount",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.GetAccountRequest,
  responseType: api_api_types_pb.GetAccountResponse
};

CryptomailApiService.GetPublicAccounts = {
  methodName: "GetPublicAccounts",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.GetPublicAccountsRequest,
  responseType: api_api_types_pb.GetPublicAccountsResponse
};

CryptomailApiService.GetMessageDepositData = {
  methodName: "GetMessageDepositData",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.GetMessageDepositDataRequest,
  responseType: api_api_types_pb.GetMessageDepositDataResponse
};

CryptomailApiService.GetCoinPrice = {
  methodName: "GetCoinPrice",
  service: CryptomailApiService,
  requestStream: false,
  responseStream: false,
  requestType: api_api_types_pb.GetCoinPriceRequest,
  responseType: api_api_types_pb.GetCoinPriceResponse
};

exports.CryptomailApiService = CryptomailApiService;

function CryptomailApiServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

CryptomailApiServiceClient.prototype.createAccount = function createAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.CreateAccount, {
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

CryptomailApiServiceClient.prototype.updateSettings = function updateSettings(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.UpdateSettings, {
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

CryptomailApiServiceClient.prototype.deleteAccount = function deleteAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.DeleteAccount, {
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

CryptomailApiServiceClient.prototype.getThreadBoxes = function getThreadBoxes(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.GetThreadBoxes, {
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

CryptomailApiServiceClient.prototype.openMessage = function openMessage(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.OpenMessage, {
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

CryptomailApiServiceClient.prototype.reply = function reply(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.Reply, {
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

CryptomailApiServiceClient.prototype.archiveThread = function archiveThread(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.ArchiveThread, {
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

CryptomailApiServiceClient.prototype.deleteThread = function deleteThread(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.DeleteThread, {
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

CryptomailApiServiceClient.prototype.newThread = function newThread(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.NewThread, {
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

CryptomailApiServiceClient.prototype.getAccount = function getAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.GetAccount, {
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

CryptomailApiServiceClient.prototype.getPublicAccounts = function getPublicAccounts(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.GetPublicAccounts, {
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

CryptomailApiServiceClient.prototype.getMessageDepositData = function getMessageDepositData(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.GetMessageDepositData, {
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

CryptomailApiServiceClient.prototype.getCoinPrice = function getCoinPrice(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(CryptomailApiService.GetCoinPrice, {
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

exports.CryptomailApiServiceClient = CryptomailApiServiceClient;

