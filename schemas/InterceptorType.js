console.log('Loading InterceptorType.js');
const helperFunctions = require('../helperfunctions');
const ByteBuffer = require('bytebuffer')

const { LaunchType } = require('./LaunchType');


const FEATURE_MAGNITUDE_NUKE = 5;
const FEATURE_MAGNITUDE_TRACKING = 2;
const FEATURE_MAGNITUDE_ECM = 2;

const DATA_SIZE = 10

module.exports.InterceptorType = class InterceptorType extends LaunchType{

    constructor(data) {
        if (!data) return
        if (data.buffer) {
            super(data);
            this.cInterceptorCost = data.readInt();
            this.fltHitChance = helperFunctions.roundFloat(data.readFloat()) // Watch out - this wasn't in the code!
            this.cSpeedIndex = data.readByte();
            this.cRangeIndex = data.readByte();
        }
        if (!data.buffer) {
            let { cID, bPurchasable, strName, lAssetID } = data;
            super(cID, bPurchasable, strName, lAssetID);

            this.cInterceptorCost = data.cInterceptorCost;
            this.cSpeedIndex = data.cSpeedIndex;
            this.cRangeIndex = data.cRangeIndex;
        }
    }
    getDataSize() {
        return DATA_SIZE
    }
}
