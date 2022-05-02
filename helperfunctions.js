console.log('Loading helperFunctions.js');
// Contained within are data processing functions. No idea how these are gonna work in the browser 🤷‍♀️
// Dependencies
const { parseString } = require('xml2js');
var ByteBuffer = require('bytebuffer');
const readline = require('readline');
const recursive = require('recursive-readdir');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const terminal = require('./terminal');
const Fraction = require('fractional').Fraction

const STRING_LENGTH_PREFIX_SIZE = 2;

module.exports.stringToSHA256 = stringToSHA256 = (str) => {
  return new ByteBuffer(32).append(
    Buffer.from(CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex), 'hex')
  );
};

module.exports.getStringDataSize = getStringDataSize = (str) => {
  return STRING_LENGTH_PREFIX_SIZE + stringToBytesBB(str).length;
};

module.exports.stringToBytesBB = stringToBytesBB = (str) => {
  const bb = new ByteBuffer();
  bb.writeString(str);
  return bb.buffer;
};

module.exports.getStringData = getStringData = (str) => {
  const bb = new ByteBuffer.allocate(getStringDataSize(str));
  cString = stringToBytesBB(str);
  bb.writeShort(cString.length);
  bb.append(cString);

  return bb.buffer;
};

module.exports.xmlToJson = xmlToJson = ({ xml }) => {
  const parsedData = parseString(xml);
  return parsedData;
};

module.exports.intFromBytes = intFromBytes = (byteArray) => {
  if (byteArray.length !== 4) return console.log('Yikes!');
  const bb = new ByteBuffer(4).append(byteArray);

  return (
    (bb.buffer[0] << 24) +
    (bb.buffer[1] << 16) +
    (bb.buffer[2] << 8) +
    bb.buffer[3]
  );
};
module.exports.roundFloat = roundFloat = (float) => Math.round(float * 100) / 100;

module.exports.getTime = getTime = (full) => {
  let currentDate = new Date();

  if (full) return currentDate.toJSON().slice(0, 19).replace('T', ' || ');
  // This is a hacky way to do it, but it works 🤷‍♀️
  return currentDate.toJSON().slice(0, 19).split('T')[1];
};

module.exports.stringFromData = stringFromData = (bb, length = false) => {
  // There is a more elegant way to do this, but it is midnight.
  let lengthOfShort = 2;
  let lengthToRead = bb.readShort();

  const cString = new ByteBuffer(lengthToRead).append(
    bb.buffer.slice(lengthOfShort, lengthToRead + lengthOfShort)
  );

  if (length) {
    return [cString.buffer.toString(), lengthToRead];
  }
  return cString.buffer.toString();
};

// The old one is retarded but I'm not fixing it right now

module.exports.stringFromDataNew = stringFromDataNew = (bb, length = false) => {
  // There is a more elegant way to do this, but it is midnight.
  let lengthToRead = bb.readShort();

  const cString = bb.readString(lengthToRead);
  
  return cString
};

module.exports.projectAudit = projectAudit = async () => {
  terminal.log('Counting lines in project:', 'code');
  const countLines = async (filteredPaths) =>
    new Promise((res, rej) => {
      var totalLines = 0;
      var filesRead = 0;
      filteredPaths.forEach((filePath, idx) => {
        let linesCount = 0;
        readline
          .createInterface({
            input: fs.createReadStream(filePath),
            output: process.stdout,
            terminal: false,
          })
          .on('line', () => {
            linesCount++;
          })
          .on('close', () => {
            // console.log(filePath, linesCount)
            filesRead++;
            totalLines = totalLines + linesCount;
            // console.log(`${filesRead}/${filteredPaths.length}`);
            if (filesRead == filteredPaths.length) res(totalLines);
          });
      });
    });
  const remove = (array, phrase) =>
    array.filter((item) => item.indexOf(phrase) == -1);

  // Get array of all file paths
  const filePaths = await recursive('./', [
    (path) => {
      var a = true;
      if (
        path.indexOf(
          'node_modules' &&
            path.indexOf('android') &&
            path.indexOf('package') &&
            path.indexOf('build') &&
            path.indexOf('message') &&
            path.indexOf('build') &&
            path.indexOf('.mext')
        ) == -1
      ) {
        a = false;
      }
      // console.log(path);
      if (path.indexOf('node_modules')) return false;
    },
  ]);
  // Filter out unwanted files
  const filtered = remove(
    remove(
      remove(
        remove(
          remove(
            remove(
              filePaths.filter(
                (path, idx) =>
                  path.slice(-3) == 'tml' ||
                  path.slice(-3) == 'jsx' ||
                  path.slice(-3) == '.js' ||
                  path.slice(-3) == 'son' ||
                  path.slice(-3) == 'tsx' ||
                  path.slice(-3) == 'css' ||
                  path.slice(-3) == 'txt' ||
                  path.slice(-3) == '.md'
              ),
              'node_modules'
            ),
            'android'
          ),
          'package'
        ),
        'build'
      ),
      '.next'
    ),
    'message'
  );
  // Pass array of filtered files to counting function
  let finalCount = await countLines(filtered);
  // Log the final count
  return 'Final Count: ' + finalCount + ', Process Complete!';
};

module.exports.crc32 = crc32=(r)=>{for(var a,o=[],c=0;c<256;c++){a=c;for(var f=0;f<8;f++)a=1&a?3988292384^a>>>1:a>>>1;o[c]=a}for(var n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r.charCodeAt(t))];return(-1^n)>>>0};
