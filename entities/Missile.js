const ByteBuffer = require('bytebuffer')
const helperFunctions = require('../helperfunctions')
const { LaunchEntity } = require('./LaunchEntity')

module.exports.Missile = class Missile extends LaunchEntity {

    

    constructor(data) {
        // If the data is passed as an object
        if (!data.buffer) {
            super(data.lID, data.geoPosition);
            this.cType = data.cType;
            this.lOwnerID = data.lOwnerID;
            this.bTracking = data.bTracking;
            this.geoTarget = data.geoTarget;
            this.lTargetID = data.lTargetID;  
        }

        // If the data is passed as a bytebuffer
        if (data.buffer) {
            super(data);
            this.cType = data.readByte();
            this.lOwnerID = data.readInt();
            this.bTracking = data.readByte() !== 0;
            this.geoTarget = [helperFunctions.roundFloat(data.readFloat()), helperFunctions.roundFloat(data.readFloat())]; // Skipping this constructor for now, just consuming bytebuffer space.
            this.lTargetID = data.readInt();
        }

        this.DATA_SIZE = 18;
   
    }

    getDataSize() {
        return DATA_SIZE;
    }

}

