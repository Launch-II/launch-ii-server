console.log('Loading config.js');

// Dependencies
const helperFunctions = require('./helperFunctions');
const ByteBuffer = require('bytebuffer');

// Entities
const { LaunchType } = require('./schemas/LaunchType');
const { MissileType } = require('./schemas/MissileType');
const { InterceptorType } = require('./schemas/InterceptorType');

//  Dear lord.

const RULES_DATA_SIZE = 365 + 9 * 4; // Rules, plus a 32-bit int count for each list.

var strServerEmailAddress;

var cVariant;
var cDebugFlags;
var lStartingWealth;
var lRespawnWealth;
var lRespawnTime;
var lRespawnProtectionTime;
var lHourlyWealth;
var lCMSSystemCost;
var lSAMSystemCost;
var lCMSStructureCost;
var lNukeCMSStructureCost;
var lSAMStructureCost;
var lSentryGunStructureCost;
var lOreMineStructureCost;
var fltvarerceptorBaseHitChance;
var fltRubbleMinValue;
var fltRubbleMaxValue;
var lRubbleMvarime;
var lRubbleMaxTime;
var fltStructureSeparation;
var nPlayerBaseHP;
var nStructureBaseHP;
var lStructureBootTime;
var cInitialMissileSlots;
var cInitialvarerceptorSlots;
var fltRequiredAccuracy;
var lMinRadiationTime;
var lMaxRadiationTime;
var lMissileUpgradeBaseCost;
var cMissileUpgradeCount;
var fltResaleValue;
var lDecommissionTime;
var lReloadTimeBase;
var lReloadTimeStage1;
var lReloadTimeStage2;
var lReloadTimeStage3;
var lReloadStage1Cost;
var lReloadStage2Cost;
var lReloadStage3Cost;
var fltRepairSalvageDistance;
var lMissileSiteMavarenanceCost;
var lSAMSiteMavarenanceCost;
var lSentryGunMavarenanceCost;
var lOreMineMavarenanceCost;
var lHealthvarerval;
var lRadiationvarerval;
var lPlayerRepairCost;
var lStructureRepairCost;
var oAWOLTime;
var oRemoveTime;
var lNukeUpgradeCost;
var lAllianceCooloffTime;
var lMissileNuclearCost;
var lMissileTrackingCost;
var lMissileECMCost;
var fltEMPChance;
var fltEMPRadiusMultiplier;
var fltECMvarerceptorChanceReduction;
var fltManualvarerceptorChanceIncrease;
var lSentryGunReloadTime;
var fltSentryGunRange;
var fltSentryGunHitChance;
var fltOreMineRadius;
var fltOreCollectRadius;
var fltOreCompeteRadius;
var lMaxOreValue;
var lOreMineGenerateTime;
var lOreMinExpiry;
var lOreMaxExpiry;
var lMissileSpeedIndexCost;
var fltMissileSpeedIndexCostPow;
var lMissileRangeIndexCost;
var fltMissileRangeIndexCostPow;
var lMissileBlastRadiusIndexCost;
var fltMissileBlastRadiusIndexCostPow;
var lNukeBlastRadiusIndexCost;
var fltNukeBlastRadiusIndexCostPow;
var lMissileMaxDamageIndexCost;
var fltMissileMaxDamageIndexCostPow;
var lvarerceptorSpeedIndexCost;
var fltvarerceptorSpeedIndexCostPow;
var lvarerceptorRangeIndexCost;
var fltvarerceptorRangeIndexCostPow;
var fltMissilePrepTimePerMagnitude;
var fltvarerceptorPrepTimePerMagnitude;
var lHourlyBonusDiplomaticPresence;
var lHourlyBonusPoliticalEngagement;
var lHourlyBonusDefenderOfTheNation;
var lHourlyBonusNuclearSuperpower;
var lHourlyBonusWeeklyKillsBatch;
var lHourlyBonusSurvivor;
var lHourlyBonusHippy;
var lHourlyBonusPeaceMaker;
var lHourlyBonusWarMonger;
var lHourlyBonusLoneWolf;
var fltLoneWolfDistance;

// Derived from other configs.
var fltOreMineDiameter;
var fltNuclearEscalationRadius;

//  protected Map<Byte, Float> MissileSpeeds = new LinkedHashMap<>();
//  Value tables. Tobster used some gay java thing, I'm using an object.

var missileSpeeds = {};
var missileRanges = {};
var missileBlastRadii = {};
var nukeBlastRadii = {};
var missileMaxDamages = {};
var interceptorSpeeds = {};
var interceptorRanges = {};

// Types. Again, object.
// protected Map<Byte, MissileType> MissileTypes = new LinkedHashMap<>();

var MissileTypes = {};
var InterceptorTypes = {};

// Communicable data, whatever that means.
var lSize;
var cData;
var lChecksum;
// let input = 20.0
// let bytes = new ByteBuffer(8).append([0,0,0,50, 0,0,0,0])
// let simpleResults = bytes.reset().readFloat64()
// let interpretedResult = helperFunctions.floatFromBytes([...bytes.reset().buffer])

// console.log({input, bytes, simpleResults})

module.exports.config = config = (cConfigData) => {

  
  cData = cConfigData;
  lSize = cConfigData.length;

  const bb = new ByteBuffer(lSize).append(cData).reset();

  const emailAddress = helperFunctions.stringFromData(bb, true);
  strServerEmailAddress = emailAddress[0];
  bb.skip(emailAddress[1]);

  // Local helper functions
  const AssignFloatPropertyTable = () => {
    var lCount = bb.readInt();

    var internalTable = {}
  
    for (let i = 0; i < lCount; i++) {
      internalTable[bb.readByte()] = helperFunctions.roundFloat(bb.readFloat())
    }
    return internalTable
  };

  const AssignShortPropertyTable = () => {
    var lCount = bb.readInt();

    var internalTable = {}
  
    for (let i = 0; i < lCount; i++) {
      internalTable[bb.readByte()] = bb.readShort()
    }
    return internalTable
  };
  
  const AssignMissileTypes = () => {
    var lMissileTypes = bb.readInt();

    var internalTable = {}
  
    for (let i = 0; i < lMissileTypes; i++) {
      let missileType = new MissileType(bb); // Create new missile object
      internalTable[missileType.getID()] = missileType;
    }
    return internalTable
  };

  const AssignInterceptorTypes = () => {
    var lInterceptorTypes = bb.readInt();

    var internalTable = {}
  
    for (let i = 0; i < lInterceptorTypes; i++) {
      let interceptorType = new InterceptorType(bb); // Create new missile object
      internalTable[interceptorType.getID()] = interceptorType;
    }
    return internalTable
  };
  //Assign rules.
  // Readfloat doesn't work right, but I don't really care right now.
  
  cVariant = bb.readByte();
  cDebugFlags = bb.readByte();
  lStartingWealth = bb.readInt();
  lRespawnWealth = bb.readInt();
  lRespawnTime = bb.readInt();
  lRespawnProtectionTime = bb.readInt();
  lHourlyWealth = bb.readInt();
  lCMSSystemCost = bb.readInt();
  lSAMSystemCost = bb.readInt();
  lCMSStructureCost = bb.readInt();
  lNukeCMSStructureCost = bb.readInt();
  lSAMStructureCost = bb.readInt();
  lSentryGunStructureCost = bb.readInt();
  lOreMineStructureCost = bb.readInt();
  fltInterceptorBaseHitChance = helperFunctions.roundFloat(bb.readFloat());
  fltRubbleMinValue = helperFunctions.roundFloat(bb.readFloat());
  fltRubbleMaxValue = helperFunctions.roundFloat(bb.readFloat());
  lRubbleMinTime = bb.readInt();
  lRubbleMaxTime = bb.readInt();
  fltStructureSeparation = helperFunctions.roundFloat(bb.readFloat());
  nPlayerBaseHP = bb.readShort();
  nStructureBaseHP = bb.readShort();
  lStructureBootTime = bb.readInt();
  cInitialMissileSlots = bb.readByte();
  cInitialInterceptorSlots = bb.readByte();
  fltRequiredAccuracy = helperFunctions.roundFloat(bb.readFloat());
  lMinRadiationTime = bb.readInt();
  lMaxRadiationTime = bb.readInt();
  lMissileUpgradeBaseCost = bb.readInt();
  cMissileUpgradeCount = bb.readByte();
  fltResaleValue = helperFunctions.roundFloat(bb.readFloat());
  lDecommissionTime = bb.readInt();
  lReloadTimeBase = bb.readInt();
  lReloadTimeStage1 = bb.readInt();
  lReloadTimeStage2 = bb.readInt();
  lReloadTimeStage3 = bb.readInt();
  lReloadStage1Cost = bb.readInt();
  lReloadStage2Cost = bb.readInt();
  lReloadStage3Cost = bb.readInt();
  fltRepairSalvageDistance = helperFunctions.roundFloat(bb.readFloat());
  lMissileSiteMaintenanceCost = bb.readInt();
  lSAMSiteMaintenanceCost = bb.readInt();
  lSentryGunMaintenanceCost = bb.readInt();
  lOreMineMaintenanceCost = bb.readInt();
  lHealthInterval = bb.readInt();
  lRadiationInterval = bb.readInt();
  lPlayerRepairCost = bb.readInt();
  lStructureRepairCost = bb.readInt();
  oAWOLTime = bb.readLong();
  oRemoveTime = bb.readLong();
  lNukeUpgradeCost = bb.readInt();
  lAllianceCooloffTime = bb.readInt();
  lMissileNuclearCost = bb.readInt();
  lMissileTrackingCost = bb.readInt();
  lMissileECMCost = bb.readInt();
  fltEMPChance = helperFunctions.roundFloat(bb.readFloat());
  fltEMPRadiusMultiplier = helperFunctions.roundFloat(bb.readFloat());
  fltECMInterceptorChanceReduction = helperFunctions.roundFloat(bb.readFloat());
  fltManualInterceptorChanceIncrease = helperFunctions.roundFloat(bb.readFloat());
  lSentryGunReloadTime = bb.readInt();
  fltSentryGunRange = helperFunctions.roundFloat(bb.readFloat());
  fltSentryGunHitChance = helperFunctions.roundFloat(bb.readFloat());
  fltOreMineRadius = helperFunctions.roundFloat(bb.readFloat());
  fltOreCollectRadius = helperFunctions.roundFloat(bb.readFloat());
  fltOreCompeteRadius = helperFunctions.roundFloat(bb.readFloat());
  lMaxOreValue = bb.readInt();
  lOreMineGenerateTime = bb.readInt();
  lOreMinExpiry = bb.readInt();
  lOreMaxExpiry = bb.readInt();
  lMissileSpeedIndexCost = bb.readInt();
  fltMissileSpeedIndexCostPow = helperFunctions.roundFloat(bb.readFloat());
  lMissileRangeIndexCost = bb.readInt();
  fltMissileRangeIndexCostPow = helperFunctions.roundFloat(bb.readFloat());
  lMissileBlastRadiusIndexCost = bb.readInt();
  fltMissileBlastRadiusIndexCostPow = helperFunctions.roundFloat(bb.readFloat());
  lNukeBlastRadiusIndexCost = bb.readInt();
  fltNukeBlastRadiusIndexCostPow = helperFunctions.roundFloat(bb.readFloat());
  lMissileMaxDamageIndexCost = bb.readInt();
  fltMissileMaxDamageIndexCostPow = helperFunctions.roundFloat(bb.readFloat());
  lInterceptorSpeedIndexCost = bb.readInt();
  fltInterceptorSpeedIndexCostPow = helperFunctions.roundFloat(bb.readFloat());
  lInterceptorRangeIndexCost = bb.readInt();
  fltInterceptorRangeIndexCostPow = helperFunctions.roundFloat(bb.readFloat());
  fltMissilePrepTimePerMagnitude = helperFunctions.roundFloat(bb.readFloat());
  fltInterceptorPrepTimePerMagnitude = helperFunctions.roundFloat(bb.readFloat());
  lHourlyBonusDiplomaticPresence = bb.readInt();
  lHourlyBonusPoliticalEngagement = bb.readInt();
  lHourlyBonusDefenderOfTheNation = bb.readInt();
  lHourlyBonusNuclearSuperpower = bb.readInt();
  lHourlyBonusWeeklyKillsBatch = bb.readInt();
  lHourlyBonusSurvivor = bb.readInt();
  lHourlyBonusHippy = bb.readInt();
  lHourlyBonusPeaceMaker = bb.readInt();
  lHourlyBonusWarMonger = bb.readInt();
  lHourlyBonusLoneWolf = bb.readInt();
  fltLoneWolfDistance = helperFunctions.roundFloat(bb.readFloat());


  missileSpeeds = AssignFloatPropertyTable();
  missileRanges = AssignFloatPropertyTable();
  missileBlastRadii = AssignFloatPropertyTable();
  nukeBlastRadii = AssignFloatPropertyTable();
  missileMaxDamages = AssignShortPropertyTable();
  interceptorSpeeds = AssignFloatPropertyTable();
  interceptorRanges = AssignFloatPropertyTable();

  MissileTypes = AssignMissileTypes();
  InterceptorTypes = AssignInterceptorTypes();

  // Calculate checksum
  lChecksum = helperFunctions.crc32(cData.toString())

  fltOreMineDiameter = fltOreCompeteRadius

  const configObject = {
    cVariant, // Variant doesn't do anything but provide the server with a means of forcing a config change.
    cDebugFlags,
    lStartingWealth,
    lRespawnWealth,
    lRespawnTime,
    lRespawnProtectionTime,
    lHourlyWealth,
    lCMSSystemCost,
    lSAMSystemCost,
    lCMSStructureCost,
    lNukeCMSStructureCost,
    lSAMStructureCost,
    lSentryGunStructureCost,
    lOreMineStructureCost,
    fltInterceptorBaseHitChance,
    fltRubbleMinValue,
    fltRubbleMaxValue,
    lRubbleMinTime,
    lRubbleMaxTime,
    fltStructureSeparation,
    nPlayerBaseHP,
    nStructureBaseHP,
    lStructureBootTime,
    cInitialMissileSlots,
    cInitialInterceptorSlots,
    fltRequiredAccuracy,
    lMinRadiationTime,
    lMaxRadiationTime,
    lMissileUpgradeBaseCost,
    cMissileUpgradeCount,
    fltResaleValue,
    lDecommissionTime,
    lReloadTimeBase,
    lReloadTimeStage1,
    lReloadTimeStage2,
    lReloadTimeStage3,
    lReloadStage1Cost,
    lReloadStage2Cost,
    lReloadStage3Cost,
    fltRepairSalvageDistance,
    lMissileSiteMaintenanceCost,
    lSAMSiteMaintenanceCost,
    lSentryGunMaintenanceCost,
    lOreMineMaintenanceCost,
    lHealthInterval,
    lRadiationInterval,
    lPlayerRepairCost,
    lStructureRepairCost,
    oAWOLTime,
    oRemoveTime,
    lNukeUpgradeCost,
    lAllianceCooloffTime,
    lMissileNuclearCost,
    lMissileTrackingCost,
    lMissileECMCost,
    fltEMPChance,
    fltEMPRadiusMultiplier,
    fltECMInterceptorChanceReduction,
    fltManualInterceptorChanceIncrease,
    lSentryGunReloadTime,
    fltSentryGunRange,
    fltSentryGunHitChance,
    fltOreMineRadius,
    lMaxOreValue,
    lOreMineGenerateTime,
    lOreMinExpiry,
    lOreMaxExpiry,
    lMissileSpeedIndexCost,
    fltMissileSpeedIndexCostPow,
    lMissileRangeIndexCost,
    fltMissileRangeIndexCostPow,
    lMissileBlastRadiusIndexCost,
    fltMissileBlastRadiusIndexCostPow,
    lNukeBlastRadiusIndexCost,
    fltNukeBlastRadiusIndexCostPow,
    lMissileMaxDamageIndexCost,
    fltMissileMaxDamageIndexCostPow,
    lInterceptorSpeedIndexCost,
    fltInterceptorSpeedIndexCostPow,
    lInterceptorRangeIndexCost,
    fltInterceptorRangeIndexCostPow,
    fltMissilePrepTimePerMagnitude,
    fltInterceptorPrepTimePerMagnitude,
    lHourlyBonusDiplomaticPresence,
    lHourlyBonusPoliticalEngagement,
    lHourlyBonusDefenderOfTheNation,
    lHourlyBonusNuclearSuperpower,
    lHourlyBonusWeeklyKillsBatch,
    lHourlyBonusSurvivor,
    lHourlyBonusHippy,
    lHourlyBonusPeaceMaker,
    lHourlyBonusWarMonger,
    lHourlyBonusLoneWolf,
    fltLoneWolfDistance,
    missileSpeeds,
    missileRanges,
    missileBlastRadii,
    nukeBlastRadii,
    missileMaxDamages,
    interceptorSpeeds,
    interceptorRanges,
    MissileTypes,
    InterceptorTypes
  }
  console.log(JSON.stringify(configObject))
};

module.exports.getCheckSum = getCheckSum = () => {
  return false;
};

