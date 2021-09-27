/* eslint-disable */
//@ts-nocheck
// source: types/accounts.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var types_types_pb = require('../types/types_pb.js');
goog.object.extend(proto, types_types_pb);
goog.exportSymbol('proto.types.Account', null, global);
goog.exportSymbol('proto.types.Reputation', null, global);
goog.exportSymbol('proto.types.Settings', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.types.Account = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.types.Account, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.types.Account.displayName = 'proto.types.Account';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.types.Settings = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.types.Settings, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.types.Settings.displayName = 'proto.types.Settings';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.types.Reputation = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.types.Reputation, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.types.Reputation.displayName = 'proto.types.Reputation';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.types.Account.prototype.toObject = function(opt_includeInstance) {
  return proto.types.Account.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.types.Account} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.types.Account.toObject = function(includeInstance, msg) {
  var f, obj = {
    idPubKey: (f = msg.getIdPubKey()) && types_types_pb.PublicKey.toObject(includeInstance, f),
    reputation: (f = msg.getReputation()) && proto.types.Reputation.toObject(includeInstance, f),
    timeCreated: jspb.Message.getFieldWithDefault(msg, 3, 0),
    timeLastLogin: jspb.Message.getFieldWithDefault(msg, 4, 0),
    settings: (f = msg.getSettings()) && proto.types.Settings.toObject(includeInstance, f),
    publicAccountInfo: (f = msg.getPublicAccountInfo()) && types_types_pb.PublicAccountInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.types.Account}
 */
proto.types.Account.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.types.Account;
  return proto.types.Account.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.types.Account} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.types.Account}
 */
proto.types.Account.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new types_types_pb.PublicKey;
      reader.readMessage(value,types_types_pb.PublicKey.deserializeBinaryFromReader);
      msg.setIdPubKey(value);
      break;
    case 2:
      var value = new proto.types.Reputation;
      reader.readMessage(value,proto.types.Reputation.deserializeBinaryFromReader);
      msg.setReputation(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTimeCreated(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTimeLastLogin(value);
      break;
    case 5:
      var value = new proto.types.Settings;
      reader.readMessage(value,proto.types.Settings.deserializeBinaryFromReader);
      msg.setSettings(value);
      break;
    case 8:
      var value = new types_types_pb.PublicAccountInfo;
      reader.readMessage(value,types_types_pb.PublicAccountInfo.deserializeBinaryFromReader);
      msg.setPublicAccountInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.types.Account.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.types.Account.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.types.Account} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.types.Account.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIdPubKey();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      types_types_pb.PublicKey.serializeBinaryToWriter
    );
  }
  f = message.getReputation();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.types.Reputation.serializeBinaryToWriter
    );
  }
  f = message.getTimeCreated();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getTimeLastLogin();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = message.getSettings();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.types.Settings.serializeBinaryToWriter
    );
  }
  f = message.getPublicAccountInfo();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      types_types_pb.PublicAccountInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional PublicKey id_pub_key = 1;
 * @return {?proto.types.PublicKey}
 */
proto.types.Account.prototype.getIdPubKey = function() {
  return /** @type{?proto.types.PublicKey} */ (
    jspb.Message.getWrapperField(this, types_types_pb.PublicKey, 1));
};


/**
 * @param {?proto.types.PublicKey|undefined} value
 * @return {!proto.types.Account} returns this
*/
proto.types.Account.prototype.setIdPubKey = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.types.Account} returns this
 */
proto.types.Account.prototype.clearIdPubKey = function() {
  return this.setIdPubKey(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.types.Account.prototype.hasIdPubKey = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Reputation reputation = 2;
 * @return {?proto.types.Reputation}
 */
proto.types.Account.prototype.getReputation = function() {
  return /** @type{?proto.types.Reputation} */ (
    jspb.Message.getWrapperField(this, proto.types.Reputation, 2));
};


/**
 * @param {?proto.types.Reputation|undefined} value
 * @return {!proto.types.Account} returns this
*/
proto.types.Account.prototype.setReputation = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.types.Account} returns this
 */
proto.types.Account.prototype.clearReputation = function() {
  return this.setReputation(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.types.Account.prototype.hasReputation = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint64 time_created = 3;
 * @return {number}
 */
proto.types.Account.prototype.getTimeCreated = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Account} returns this
 */
proto.types.Account.prototype.setTimeCreated = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional uint64 time_last_login = 4;
 * @return {number}
 */
proto.types.Account.prototype.getTimeLastLogin = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Account} returns this
 */
proto.types.Account.prototype.setTimeLastLogin = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional Settings settings = 5;
 * @return {?proto.types.Settings}
 */
proto.types.Account.prototype.getSettings = function() {
  return /** @type{?proto.types.Settings} */ (
    jspb.Message.getWrapperField(this, proto.types.Settings, 5));
};


/**
 * @param {?proto.types.Settings|undefined} value
 * @return {!proto.types.Account} returns this
*/
proto.types.Account.prototype.setSettings = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.types.Account} returns this
 */
proto.types.Account.prototype.clearSettings = function() {
  return this.setSettings(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.types.Account.prototype.hasSettings = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional PublicAccountInfo public_account_info = 8;
 * @return {?proto.types.PublicAccountInfo}
 */
proto.types.Account.prototype.getPublicAccountInfo = function() {
  return /** @type{?proto.types.PublicAccountInfo} */ (
    jspb.Message.getWrapperField(this, types_types_pb.PublicAccountInfo, 8));
};


/**
 * @param {?proto.types.PublicAccountInfo|undefined} value
 * @return {!proto.types.Account} returns this
*/
proto.types.Account.prototype.setPublicAccountInfo = function(value) {
  return jspb.Message.setWrapperField(this, 8, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.types.Account} returns this
 */
proto.types.Account.prototype.clearPublicAccountInfo = function() {
  return this.setPublicAccountInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.types.Account.prototype.hasPublicAccountInfo = function() {
  return jspb.Message.getField(this, 8) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.types.Settings.prototype.toObject = function(opt_includeInstance) {
  return proto.types.Settings.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.types.Settings} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.types.Settings.toObject = function(includeInstance, msg) {
  var f, obj = {
    publicListAccount: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    displayArtBackground: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
    active: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.types.Settings}
 */
proto.types.Settings.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.types.Settings;
  return proto.types.Settings.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.types.Settings} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.types.Settings}
 */
proto.types.Settings.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPublicListAccount(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setDisplayArtBackground(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setActive(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.types.Settings.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.types.Settings.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.types.Settings} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.types.Settings.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPublicListAccount();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getDisplayArtBackground();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getActive();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional bool public_list_account = 1;
 * @return {boolean}
 */
proto.types.Settings.prototype.getPublicListAccount = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.types.Settings} returns this
 */
proto.types.Settings.prototype.setPublicListAccount = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional bool display_art_background = 2;
 * @return {boolean}
 */
proto.types.Settings.prototype.getDisplayArtBackground = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.types.Settings} returns this
 */
proto.types.Settings.prototype.setDisplayArtBackground = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional bool active = 3;
 * @return {boolean}
 */
proto.types.Settings.prototype.getActive = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.types.Settings} returns this
 */
proto.types.Settings.prototype.setActive = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.types.Reputation.prototype.toObject = function(opt_includeInstance) {
  return proto.types.Reputation.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.types.Reputation} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.types.Reputation.toObject = function(includeInstance, msg) {
  var f, obj = {
    openPaidMessagesReceived: jspb.Message.getFieldWithDefault(msg, 1, 0),
    openPaidMessageOpened: jspb.Message.getFieldWithDefault(msg, 2, 0),
    messagesReplyPaidReceived: jspb.Message.getFieldWithDefault(msg, 3, 0),
    messagesReplyPaidOpened: jspb.Message.getFieldWithDefault(msg, 4, 0),
    paymentRedeemedNoOpen: jspb.Message.getFieldWithDefault(msg, 5, 0),
    paymentRedeemedNoReply: jspb.Message.getFieldWithDefault(msg, 6, 0),
    reputationScore: jspb.Message.getFloatingPointFieldWithDefault(msg, 7, 0.0),
    ogRank: jspb.Message.getFieldWithDefault(msg, 8, 0),
    cmailTokenBalanceCurPeriod: jspb.Message.getFieldWithDefault(msg, 9, 0),
    lastDropCmailTokens: jspb.Message.getFieldWithDefault(msg, 10, 0),
    cmailTokenBalanceTotalEarned: jspb.Message.getFieldWithDefault(msg, 11, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.types.Reputation}
 */
proto.types.Reputation.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.types.Reputation;
  return proto.types.Reputation.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.types.Reputation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.types.Reputation}
 */
proto.types.Reputation.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setOpenPaidMessagesReceived(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setOpenPaidMessageOpened(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setMessagesReplyPaidReceived(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setMessagesReplyPaidOpened(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setPaymentRedeemedNoOpen(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setPaymentRedeemedNoReply(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setReputationScore(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setOgRank(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setCmailTokenBalanceCurPeriod(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setLastDropCmailTokens(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setCmailTokenBalanceTotalEarned(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.types.Reputation.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.types.Reputation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.types.Reputation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.types.Reputation.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOpenPaidMessagesReceived();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getOpenPaidMessageOpened();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getMessagesReplyPaidReceived();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getMessagesReplyPaidOpened();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = message.getPaymentRedeemedNoOpen();
  if (f !== 0) {
    writer.writeUint64(
      5,
      f
    );
  }
  f = message.getPaymentRedeemedNoReply();
  if (f !== 0) {
    writer.writeUint64(
      6,
      f
    );
  }
  f = message.getReputationScore();
  if (f !== 0.0) {
    writer.writeFloat(
      7,
      f
    );
  }
  f = message.getOgRank();
  if (f !== 0) {
    writer.writeUint64(
      8,
      f
    );
  }
  f = message.getCmailTokenBalanceCurPeriod();
  if (f !== 0) {
    writer.writeUint64(
      9,
      f
    );
  }
  f = message.getLastDropCmailTokens();
  if (f !== 0) {
    writer.writeUint64(
      10,
      f
    );
  }
  f = message.getCmailTokenBalanceTotalEarned();
  if (f !== 0) {
    writer.writeUint64(
      11,
      f
    );
  }
};


/**
 * optional uint64 open_paid_messages_received = 1;
 * @return {number}
 */
proto.types.Reputation.prototype.getOpenPaidMessagesReceived = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setOpenPaidMessagesReceived = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint64 open_paid_message_opened = 2;
 * @return {number}
 */
proto.types.Reputation.prototype.getOpenPaidMessageOpened = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setOpenPaidMessageOpened = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 messages_reply_paid_received = 3;
 * @return {number}
 */
proto.types.Reputation.prototype.getMessagesReplyPaidReceived = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setMessagesReplyPaidReceived = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional uint64 messages_reply_paid_opened = 4;
 * @return {number}
 */
proto.types.Reputation.prototype.getMessagesReplyPaidOpened = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setMessagesReplyPaidOpened = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional uint64 payment_redeemed_no_open = 5;
 * @return {number}
 */
proto.types.Reputation.prototype.getPaymentRedeemedNoOpen = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setPaymentRedeemedNoOpen = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional uint64 payment_redeemed_no_reply = 6;
 * @return {number}
 */
proto.types.Reputation.prototype.getPaymentRedeemedNoReply = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setPaymentRedeemedNoReply = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional float reputation_score = 7;
 * @return {number}
 */
proto.types.Reputation.prototype.getReputationScore = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 7, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setReputationScore = function(value) {
  return jspb.Message.setProto3FloatField(this, 7, value);
};


/**
 * optional uint64 og_rank = 8;
 * @return {number}
 */
proto.types.Reputation.prototype.getOgRank = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setOgRank = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};


/**
 * optional uint64 cmail_token_balance_cur_period = 9;
 * @return {number}
 */
proto.types.Reputation.prototype.getCmailTokenBalanceCurPeriod = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setCmailTokenBalanceCurPeriod = function(value) {
  return jspb.Message.setProto3IntField(this, 9, value);
};


/**
 * optional uint64 last_drop_cmail_tokens = 10;
 * @return {number}
 */
proto.types.Reputation.prototype.getLastDropCmailTokens = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setLastDropCmailTokens = function(value) {
  return jspb.Message.setProto3IntField(this, 10, value);
};


/**
 * optional uint64 cmail_token_balance_total_earned = 11;
 * @return {number}
 */
proto.types.Reputation.prototype.getCmailTokenBalanceTotalEarned = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 11, 0));
};


/**
 * @param {number} value
 * @return {!proto.types.Reputation} returns this
 */
proto.types.Reputation.prototype.setCmailTokenBalanceTotalEarned = function(value) {
  return jspb.Message.setProto3IntField(this, 11, value);
};


goog.object.extend(exports, proto.types);
