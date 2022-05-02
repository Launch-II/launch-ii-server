console.log('Loading clientComms.js');
// Contained within are methods the client needs to communicate with the server.

// Dependencies
var ByteBuffer = require('bytebuffer');
// Imports
const helperFunctions = require('./helperfunctions');
const clientSession = require('./clientSession');
const terminal = require('./terminal');
// Variables
const OBJECT_HEADER_SIZE = 17; //Type (1) + ObjectNo (4) + InstanceNo (4) + Start (4) + Length (4).
const COMMAND_HEADER_SIZE = 9; //Type (1) + CommandType (4) + InstanceNo (4). 🤷‍♂️

const MESSAGE_TYPE_REQUEST = 1;
const MESSAGE_TYPE_SEND = 2;
const MESSAGE_TYPE_COMMAND = 3;
const MESSAGE_TYPE_REQUEST_ZIP = 4;
const MESSAGE_TYPE_SEND_ZIP = 5;
const MESSAGE_TYPE_COMMAND_ZIP = 6;

const SIZEOF_INT = 4;

SHA256_SIZE = 32;

var state;

var bObjectSync = false;

module.exports.updateState = updateState = (s) => {
  state = s;
  return;
};

module.exports.authenticate = authenticate = ({
  deviceHash,
  strDeviceName,
  strProcessName,
  majorVersion,
}) => {
  const cDeviceID = deviceHash;
  const cAuthFlags = '';

  const bb = new ByteBuffer(
    SHA256_SIZE +
      3 +
      helperFunctions.getStringDataSize(strDeviceName) +
      helperFunctions.getStringDataSize(strProcessName)
  );
  // terminal.log('cDeviceID', 'code', cDeviceID)
  // bb.append(cDeviceID);
  bb.append(cDeviceID);
  bb.writeShort(majorVersion);
  bb.append(helperFunctions.getStringData(strDeviceName));
  bb.append(helperFunctions.getStringData(strProcessName));
  bb.append(helperFunctions.getStringData(cAuthFlags));

  sendObject({
    lObject: clientSession.Authorize,
    cData: bb.buffer,
  });
};
module.exports.getSendObjectData = getSendObjectData = ({
  lObject,
  lInstanceNumber,
  lStart,
  cData,
}) => {
  const bb = new ByteBuffer(OBJECT_HEADER_SIZE + cData.length);

  bb.writeByte(MESSAGE_TYPE_SEND);
  bb.writeInt(lObject);
  bb.writeInt(lInstanceNumber);
  bb.writeInt(lStart);
  bb.writeInt(cData.length);
  bb.append(cData);

  return bb.buffer;
};

module.exports.getSendCommandData = getSendCommandData = ({
  lCommand,
  lInstanceNumber,
}) => {
  const bb = new ByteBuffer(COMMAND_HEADER_SIZE);
  bb.writeByte(MESSAGE_TYPE_COMMAND);
  bb.writeInt(lCommand);
  bb.writeInt(lInstanceNumber);

  return bb.buffer;
};

module.exports.getRequestObjectData = getRequestObjectData = ({
  lObject,
  lInstanceNumber,
  lStart,
  lLength,
}) => {
  const bb = new ByteBuffer(OBJECT_HEADER_SIZE);
  bb.writeByte(MESSAGE_TYPE_REQUEST);
  bb.writeInt(lObject);
  bb.writeInt(lInstanceNumber);
  bb.writeInt(lStart);
  bb.writeInt(lLength);

  return bb.buffer;
};

module.exports.sendCommand = sendCommand = ({ lCommand, lInstanceNumber }) => {
  if (lCommand?.toString() && lInstanceNumber?.toString()) {
    clientSession.bytesToSend({
      cData: getSendCommandData({
        lCommand,
        lInstanceNumber,
      }),
    });
    return;
  }
  if (lCommand?.toString()) {
    clientSession.bytesToSend({
      cData: getSendCommandData({
        lCommand,
        lInstanceNumber: 0,
      }),
    });
    return;
  }
  terminal.log('No data', 'code');
};
module.exports.sendObject = sendObject = ({
  lObject,
  lInstanceNumber,
  lStart,
  cData,
}) => {
  // terminal.log('sendObject function running...', 'code');
  // terminal.log('sendObject args:', 'code', {lInstanceNumber, lObject, lStart, cData})
  if (
    lObject?.toString() &&
    lInstanceNumber?.toString() &&
    lStart.toString() &&
    cData.toString()
  ) {
    clientSession.bytesToSend({
      cData: getSendObjectData({
        lObject,
        lInstanceNumber,
        lStart,
        cData,
      }),
    });
    return;
  }
  if (lObject?.toString() && lInstanceNumber?.toString() && cData.toString()) {
    return;
  }
  if (lObject?.toString() && cData) {
    clientSession.bytesToSend({
      cData: getSendObjectData({
        lObject,
        lInstanceNumber: 0,
        lStart: 0,
        cData,
      }),
    });
    return;
  }
  terminal.log('No data', 'code');
};

module.exports.requestObject = requestObject = ({
  lObject,
  lInstanceNumber,
  lStart,
  lLength,
}) => {
  // terminal.log('requestObject function running...', 'code');
  if (
    (lObject || lObject == 0) &&
    (lInstanceNumber || lInstanceNumber == 0) &&
    (lStart || lStart == 0) &&
    (lLength || lLength == 0)
  ) {
    clientSession.bytesToSend({
      cData: getRequestObjectData({
        lObject,
        lInstanceNumber,
        lStart,
        lLength,
      }),
    });
    return;
  }
  if (
    (lObject || lObject == 0) &&
    (lInstanceNumber || lInstanceNumber == 0) &&
    (lLength || lLength == 0)
  ) {
    return;
  }
  if (lObject || lObject == 0) {
    clientSession.bytesToSend({
      cData: getRequestObjectData({
        lObject,
        lInstanceNumber: 0,
        lStart: 0,
        lLength: 0,
      }),
    });
    return;
  }
  terminal.log('No data', 'code');
};

// What stage of byte processing the function is in.
var processingState = 'idle';
// The bytebuffer used to store integer values
var byteBufferInt;
// The byteBuffer used to store data
var byteBufferData;
// The type of message, stored as an integer (byte? fuck if I know) - this determines how the data is read
var cMessageType;
// The type of object that the bytearray represents.
var lObjectType;

var lInstanceNumber;

var lStart;

var lLength;

module.exports.discharge = discharge = ({ reason }) => {
  // terminal.log('discharge reason:', 'code', reason);
  var lRecievedObjectType = lObjectType;
  var lRecievedInstanceNumber = lInstanceNumber;

  switch (cMessageType) {
    case MESSAGE_TYPE_REQUEST:
      // terminal.log('Request received from server', 'code');
      break;
    case MESSAGE_TYPE_SEND:
      // terminal.log('Message_type_send received from server', 'code');

      const cData = [...byteBufferData.buffer];
      const lReceivedStart = lStart;

      clientSession.objectReceived({
        lObject: lRecievedObjectType,
        lInstanceNumber: lRecievedInstanceNumber,
        lOffset: lReceivedStart,
        cData,
      });
      break;
    case MESSAGE_TYPE_COMMAND:
      // terminal.log(
      //   `Command received from server: ${lRecievedObjectType}`,
      //   'code'
      // );
      clientSession.commandReceived({
        lCommand: lRecievedObjectType,
        lInstanceNumber,
      });
      break;
    default:
      terminal.log(
        'Somehow an invalid data type in the discharge. Something is monumentally fucked up',
        'error'
      );
      break;
  }
  // terminal.log('discharge complete', 'code');
  processingState = 'idle';
  return;
};

module.exports.processBytes = processBytes = (cData) => {
  // console.log('processing Bytes:', cData);
  cData.forEach((cByte, idx) => {
    if (processingState == 'idle') {
      cMessageType = cByte;
      // Check if cMessageType equals a valid message type
      if (
        cMessageType == MESSAGE_TYPE_REQUEST ||
        cMessageType == MESSAGE_TYPE_SEND ||
        cMessageType == MESSAGE_TYPE_COMMAND
      ) {
        // Change the processing state
        processingState = 'objectNo';
        // No idea 🤷‍♂️
        byteBufferInt = new ByteBuffer(SIZEOF_INT);
        return;
      } else {
        terminal.log(`Ooopsie poopsie, the MESSAGE_TYPE isn't valid!`, 'error');
        return;
      }
      return;
    }
    if (processingState == 'objectNo') {
      byteBufferInt.writeByte(cByte);
      // Once all slots in the byte buffer are occupied, move to next state
      if (byteBufferInt.offset == byteBufferInt.limit) {
        //  Store object type

        lObjectType = helperFunctions.intFromBytes([...byteBufferInt.buffer]);
        // reset byteBufferInt
        byteBufferInt = new ByteBuffer(SIZEOF_INT);
        processingState = 'instanceNo';
        return;
      }
      return;
    }
    if (processingState == 'instanceNo') {
      byteBufferInt.writeByte(cByte);

      if (byteBufferInt.offset == byteBufferInt.limit) {
        // Store the instance number
        lInstanceNumber = helperFunctions.intFromBytes([
          ...byteBufferInt.buffer,
        ]);
        // Reset byteBufferInt
        byteBufferInt = new ByteBuffer(SIZEOF_INT);
        // Decide what to do depending on message type.
        if (cMessageType == MESSAGE_TYPE_COMMAND) {
          discharge({ reason: 'command' });
          return;
        }
        processingState = 'start';
        return;
      }
      return;
    }
    if (processingState == 'start') {
      byteBufferInt.writeByte(cByte);
      if (byteBufferInt.offset == byteBufferInt.limit) {
        // Store the start position
        lStart = helperFunctions.intFromBytes([...byteBufferInt.buffer]);

        // Reset byteBufferInt
        byteBufferInt = new ByteBuffer(SIZEOF_INT);
        processingState = 'length';
        return;
      }
      return;
    }
    if (processingState == 'length') {
      // 0, 0, 4, 75
      byteBufferInt.writeByte(cByte);

      if (byteBufferInt.offset == byteBufferInt.limit) {
        // Store the length
        lLength = helperFunctions.intFromBytes([...byteBufferInt.buffer]);
        // Reset byteBufferInt
        byteBufferInt = new ByteBuffer(SIZEOF_INT);
        // Allocate length for data or Discharge, if no data payload

        if (cMessageType == MESSAGE_TYPE_REQUEST) {
          discharge({ reason: 'request' });
          return;
        }
        byteBufferData = new ByteBuffer(lLength);
        processingState = 'data';
        return;
      }
      return;
    }
    if (processingState == 'data') {
      byteBufferData.writeByte(cByte);

      // Once chunk of data is fully processed, discharge
      if (byteBufferData.offset == byteBufferData.limit) {
        // terminal.log('processBytes data:', 'code', {
        //   processingState,
        //   cMessageType,
        //   lInstanceNumber,
        //   lStart,
        //   lObjectType,
        //   lLength,
        //   byteBufferData,
        // });

        discharge({ reason: 'data finished' });
        return;
      }
      return;
    }
    if (processingState == 'report') {
      terminal.log(
        {
          processingState,
          lObjectType,
          cMessageType,
          lInstanceNumber,
          lStart,
          lLength,
        },
        'code'
      );

      processingState = 'stop!';
    }
    return;
  });
};

module.exports.register = register = ({ strUsername, lAvatarId }) => {
  const cDeviceID = clientSession.values.deviceHash;

  const bb = new ByteBuffer(
    SHA256_SIZE + helperFunctions.getStringDataSize(strUsername) + 4
  );

  // console.log('test', new ByteBuffer(SHA256_SIZE).append(cDeviceID).append(Array(16).fill(2)))
  bb.append(cDeviceID);
  bb.append(helperFunctions.getStringData(strUsername));
  bb.writeInt(lAvatarId);

  cData = bb.buffer;

  sendObject({
    lObject: clientSession.Registration,
    lInstanceNumber: 0,
    lStart: 0,
    cData,
  });

  return;
};

// processBytes(new ByteBuffer(63).append([2, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 50, 48, 70, 67, 68, 65, 55, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 70, 97, 107, 101, 85, 115, 101, 114, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 33, 0, 0, 0, 0, 0, 0]).buffer);
