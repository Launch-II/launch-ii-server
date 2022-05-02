console.log('Loading MissileType.js');
const helperFunction = require('../helperfunctions');
const ByteBuffer = require('bytebuffer')

const { LaunchType } = require('./LaunchType');


const FEATURE_MAGNITUDE_NUKE = 5;
const FEATURE_MAGNITUDE_TRACKING = 2;
const FEATURE_MAGNITUDE_ECM = 2;

const DATA_SIZE = 11

module.exports.MissileType = class MissileType extends LaunchType{

    constructor(data) {
        if (!data) return
        if (data.buffer) {
            super(data);
            this.bNuclear = (data.readByte() !== 0);
            this.bTracking = (data.readByte() !== 0);
            this.bECM = (data.readByte() !== 0);
            this.cSpeedIndex = data.readByte();
            this.cMissileCost = data.readInt()
            this.cRangeIndex = data.readByte();
            this.cBlastRadiusIndex = data.readByte();
            this.cMaxDamageIndex = data.readByte();
        }
        if (!data.buffer) {
            let { cID, bPurchasable, strName, lAssetID } = data;
            super(cID, bPurchasable, strName, lAssetID);

            this.bNuclear = data.bNuclear;
            this.bTracking = data.bTracking;
            this.bECM = data.bECM;
            this.cSpeedIndex = data.cSpeedIndex;
            this.cMissileCost = data.cMissileCost;
            this.cRangeIndex = data.cRangeIndex;
            this.cBlastRadiusIndex = data.cBlastRadiusIndex;
            this.cMaxDamageIndex = data.cMaxDamageIndex;
        }
    }
    getDataSize() {
        return DATA_SIZE
    }
}
