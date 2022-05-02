console.log('Loading game.js');
// Dependencies
const clientSession = require('./clientSession');
const config = require('./config');
// Entity containers
var Players = [];
var Missiles = [];
var Interceptors = [];
var MissileSites = [];
var SAMSites = [];
var OreMines = [];
var SentryGuns = [];
var Loots = [];
var Radiations = [];
var Alliances = [];
var Treaties = [];
var AllStructures = [];

var lOurPlayerID;

module.exports.verifyVersion = verifyVersion = (
  nMajorVersion,
  nMinorVersion
) => {
  if (nMajorVersion !== state.nMajorVersion) {
    return false;
    // Open UI and complain
  }
  if (nMinorVersion !== state.nMinorVersion) {
    return false;
    // Open UI and complain
  }

  return true;
};

module.exports.getGameConfigChecksum = () => {
  // Tob returns a 'duff' whatever that is
  if (!config) return 0;

  return config.getCheckSum(); // Need to make the config file. YIKES!
};

module.exports.snapshotBegin = snapshotBegin = () => {
  // Create new entity containers. What does this mean? Fuck if I know.
  // Best guess is that it's creating arrays for each type of game entity.
  var newPlayers = [];
  var newMissiles = [];
  var newInterceptors = [];
  var newMissileSites = [];
  var newSAMSites = [];
  var newOreMines = [];
  var newSentryGuns = [];
  var newLoots = [];
  var newRadiations = [];
  var newAlliances = [];
  var newTreaties = [];
  var newAllStructures = [];

  // Here I'm supposed to let the game know I'm still receiving a snapshot.
  globalThis.state.receivingSnapshot = true;
};
module.exports.snapshotFinish = snapshotFinish = () => {
  players = newPlayers;
  missiles = newMissiles;
  interceptors = newInterceptors;
  missileSites = newMissileSites;
  SAMSites = newSAMSites;
  oreMines = newOreMines;
  sentryGuns = newSentryGuns;
  loots = newLoots;
  radiations = newRadiations;
  alliances = newAlliances;
  treaties = newTreaties;
  allStructures = newAllStructures;

  //   EstablishAllStructureThreats(); // I can't do this yet. LaunchClientGame.java line 1474

  //   application.MajorChanges(); // Same as above, line 1476
};

module.exports.setOurPlayerId = setOurPlayerId = (lPlayerID) => {
  lOurPlayerID = lPlayerID;
  return;
};
module.exports.gameTick = gameTick = () => {
  // This function is run every tick, and it iterates all data relevant to game elements.

  players.forEach((player, idx) => {});
  missiles.forEach((missile, idx) => {});
  interceptors.forEach((interceptor, idx) => {});
  missileSites.forEach((missileSite, idx) => {});
  SAMsites.forEach((SAMsite, idx) => {});
  sentryGuns.forEach((sentryGun, idx) => {});
  oreMines.forEach((oreMine, idx) => {});
  loots.forEach((loot, idx) => {});
  radiations.forEach((radiation, idx) => {});

  state.receivingSnapshot = false;
};

module.exports.setConfig = setConfig = (config) => {
  console.log('config:', config);
};
snapshotBegin();
