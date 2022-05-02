console.log('Loading LaunchEntity.js')
const ByteBuffer = require('bytebuffer')
const helperFunctions = require('../helperfunctions')

// FUTURE ME: IF YOU RUN INTO ISSUES HERE, IT'S PROBABLY BECAUSE THIS HAS BEEN CREATED FROM THE TOBSTER MISSILE SCHEMA, NOT THE CORBIN SCHEMA!!!

module.exports.LaunchEntity = class LaunchEntity {
    
    constructor(data) {
        // Accepts a bytebuffer or an object with parameters
        this.DATA_SIZE = 12
        if (!data) return
        if (data.buffer) {
            this.lID = data.readInt();
            this.geoPosition = [helperFunctions.roundFloat(data.readFloat()), helperFunctions.roundFloat(data.readFloat())];
        }
        if(!data.buffer) {
            this.lID = data.lId;
            this.geoPosition = data.geoPosition;
        }
    }

    getID() {
        return this.lID;
    }
    getPosition() {
        return this.geoPosition;
    }
}