global.state = {
  // This is a development clusterfuck.
  // State has to be defined prior to importing files that might reference global state.
  // This will (likely) eventually be a global state within the app. I miss useContext() desperately.
  connectionDead: true,
  authenticated: false,
  authenticating: false,
  registered: false,
  requestingConfig: true,
  hasConfig: false,
  requestingSnapshot: false,
  hasGameSnapshot: false,
  receivingSnapshot: false, // redundant, but whatever.
  playerID: null,
  nMajorVersion: 34,
  nMinorVersion: 0,
};

console.clear(); // Because it's a pain in the ass to type 'cls' every time.
console.log(
  '==================================================================='
);
console.log('Client server started!');
console.log('Loading clientSession.js');
// This file represents the actual connection to the server
// Definitions
module.exports.Authorize = 0; //Request to authorise, using encrypted device ID.
module.exports.UserData = 1; //User data. Admin's eyes only.
module.exports.PermBanData = 2; //Player is permanently banned, with reason.
module.exports.BanData = 3; //Player is banned, with duration and reason.
module.exports.Registration = 4; //Account registration request details.
module.exports.GameSnapshot = 5; //A new snapshot of the entire game, for every new comms session.
module.exports.LocationUpdate = 6; //Regular location data from players.
module.exports.Player = 7; //A player.
module.exports.Missile = 8; //A missile.
module.exports.Interceptor = 9; //An interceptor missile.
module.exports.MissileSite = 10; //A missile launch site.
module.exports.SamSite = 11; //A SAM site.
module.exports.OreMine = 12; //An ore mine.
module.exports.SentryGun = 13; //A sentry gun.
module.exports.Loot = 14; //A loot cache.
module.exports.Radiation = 15; //A radioactive area.
module.exports.AllianceMinor = 16; //An alliance minor change (i.e. points change).
module.exports.AllianceMajor = 17; //An alliance major change that should trigger a UI refresh (i.e. players joining/leaving, etc).
module.exports.Treaty = 18; //A treaty.
module.exports.Avatar = 19; //An avatar.
//20 is reserved.
module.exports.Config = 21; //The game configuration.
//22 is reserved.
module.exports.Event = 23; //An event message.
module.exports.Report = 24; //A report message.
module.exports.BuildMissileSite = 25; //A request to build a missile site.
module.exports.SellMissile = 26; //A request to sell a missile.
module.exports.SellInterceptor = 27; //A request to sell an interceptor.
module.exports.Ban = 28; //Ban a player (as an administrator).
module.exports.FullPlayerStats = 29; //A player's stats.
module.exports.LaunchMissile = 30; //A request to launch a missile.
module.exports.LaunchPlayerMissile = 31; //A request to launch a missile.
module.exports.LaunchInterceptor = 32; //A request to launch an interceptor.
module.exports.LaunchPlayerInterceptor = 33; //A request to launch an interceptor.
module.exports.AlertStatus = 34; //A request for alert status.
module.exports.SAMSiteModeChange = 35; //An instruction to change a SAM site mode.
module.exports.SAMSiteNameChange = 36; //An instruction to change a SAM site name.
module.exports.MissileSiteNameChange = 37; //An instruction to change a missile site name.
module.exports.SentryGunNameChange = 38; //An instruction to change a sentry gun name.
module.exports.OreMineNameChange = 39; //An instruction to change an ore mine name.
module.exports.CreateAlliance = 40; //Alliance creation details.
module.exports.PurchaseMissiles = 41; //A request to purchase missiles.
module.exports.PurchaseInterceptors = 42; //A request to purchase interceptors.
module.exports.ProcessNames = 43; //A list of process names, when location spoofing has been suspected.
module.exports.DeviceCheck = 44; //Device check information.
module.exports.RenamePlayer = 45; //A request for a player to change their name.
module.exports.RenameAlliance = 46; //A request to change the name of an alliance.
module.exports.RedescribeAlliance = 47; //A request to change an alliance description.
module.exports.MissileSitesOnOff = 48; //An instruction to bring multiple missile sites online or take them offline.
module.exports.SAMSitesOnOff = 49; //An instruction to bring multiple SAM sites online or take them offline.
module.exports.SentryGunsOnOff = 50; //An instruction to bring multiple sentry guns online or take them offline.
module.exports.OreMinesOnOff = 51; //An instruction to bring multiple ore mines online or take them offline.
module.exports.ImgAsset = 52; //An image.

//Commands.
module.exports.AccountUnregistered = 0; //The account must be registered (present user with form).
module.exports.MajorVersionInvalid = 1; //Notify the client that a major update is available.
module.exports.NameTaken = 2; //The player or alliance name already exists.
module.exports.AccountCreateSuccess = 3; //The account was created successfully.
//4 & 5 are reserved.
module.exports.SnapshotBegin = 6; //Indicates the start of a requested game snapshot.
module.exports.SnapshotComplete = 7; //Indicates the end of a requested game snapshot.
module.exports.SnapshotAck = 8; //Acknowledges receipt of the end of the snapshot.
module.exports.ImageError = 9; //Error reading image data.
module.exports.ActionSuccess = 10; //The last action was completed.
module.exports.ActionFailed = 11; //The last action failed for an unspecified reason.
module.exports.PurchaseMissileSystem = 12; //A request to purchase a missile system for a player.
module.exports.PurchaseSAMSystem = 13; //A request to purchase an air defence system for a player.
module.exports.BuildSamSite = 14; //A request to build a SAM site.
module.exports.BuildSentryGun = 15; //A request to build a sentry gun.
module.exports.BuildOreMine = 16; //A request to build an ore mine.
module.exports.ReportAck = 17; //A client acking a report so it may be deleted.
module.exports.KeepAlive = 18; //A keepalive for when location information isn't available.
module.exports.RemovePlayer = 19; //A player has left the game and must be removed.
module.exports.RemoveMissile = 20; //A missile has been removed from the game.
module.exports.RemoveInterceptor = 21; //An interceptor has been removed from the game.
module.exports.RemoveMissileSite = 22; //A missile site has been removed from the game.
module.exports.RemoveSAMSite = 23; //A SAM site has been removed from the game.
module.exports.RemoveOreMine = 24; //An ore mine has been removed from the game.
module.exports.RemoveSentryGun = 25; //A sentry gun has been removed from the game.
module.exports.RemoveLoot = 26; //A loot has been removed from the game.
module.exports.RemoveRadiation = 27; //A radioactive area has been removed from the game.
module.exports.RemoveAlliance = 28; //An alliance has been removed from the game.
module.exports.RemoveTreaty = 29; //A treaty has been removed from the game.
module.exports.Respawn = 30; //A request to respawn.
module.exports.PlayerMissileSlotUpgrade = 31; //A request to upgrade missile slots on player's CMS system.
module.exports.PlayerInterceptorSlotUpgrade = 32; //A request to upgrade interceptor slots on player's SAM system.
module.exports.MissileSlotUpgrade = 33; //A request to upgrade missile slots on a missile site (instance no).
module.exports.InterceptorSlotUpgrade = 34; //A request to upgrade interceptor slots on a SAM site (instance no).
module.exports.PlayerMissileReloadUpgrade = 35; //A request to upgrade reloading on player's CMS system.
module.exports.PlayerInterceptorReloadUpgrade = 36; //A request to upgrade reloading on player's SAM system.
module.exports.MissileReloadUpgrade = 37; //A request to upgrade reloading on a missile site (instance no).
module.exports.InterceptorReloadUpgrade = 38; //A request to upgrade reloading on a SAM site (instance no).
module.exports.SellMissileSite = 39; //A request to sell a missile site.
module.exports.SellSAMSite = 40; //A request to sell a SAM site.
module.exports.SellSentryGun = 41; //A request to sell a sentry gun.
module.exports.SellOreMine = 42; //A request to sell an ore mine.
module.exports.SellMissileSystem = 43; //A request to sell a missile system.
module.exports.SellSAMSystem = 44; //A request to sell a SAM system.
module.exports.RepairMissileSite = 45; //A request to remotely repair the missile site with instance number.
module.exports.RepairSAMSite = 46; //A request to remotely repair the SAM site with instance number.
module.exports.RepairSentryGun = 47; //A request to remotely repair the sentry gun with instance number.
module.exports.RepairOreMine = 48; //A request to remotely repair the ore mine with instance number.
module.exports.Heal = 49; //A request to fully heal the player.
module.exports.SetAvatar = 50; //A request to set an avatar ID.
module.exports.CloseAccount = 51; //A request to close the player's account.
module.exports.AlertAllClear = 52; //Alert indication that a player is not under attack.
module.exports.AlertUnderAttack = 53; //Alert indication that a player is under attack.
module.exports.AlertNukeEscalation = 54; //Alert indication that a player's ally is under attack.
module.exports.AlertAllyUnderAttack = 55; //Alert indication that a player's ally is under attack.
//56 & 57 are reserved.
module.exports.UpgradeMissileSiteNuclear = 58; //A request to upgrade a missile site to nuclear capabilities.
module.exports.JoinAlliance = 59; //A request to join the specified alliance.
module.exports.LeaveAlliance = 60; //A request to leave any alliance the player is a member of.
module.exports.DeclareWar = 61; //A request for the player's alliance to declare war on the specified alliance.
module.exports.SetAllianceAvatar = 62; //A request to set an alliance avatar ID.
module.exports.Promote = 63; //A request to promote an alliance member to a leader.
module.exports.AcceptJoin = 64; //Accept a player into the alliance you lead.
module.exports.RejectJoin = 65; //Reject a player's request to join the alliance you lead.
module.exports.Kick = 66; //Kick a player from the alliance you lead.
module.exports.ResetName = 67; //Reset a player's name (as an administrator).
module.exports.ResetAvatar = 68; //Reset a player's avatar (as an administrator).
module.exports.ProposeAffiliation = 69; //An offer of a peace treaty to another alliance.
module.exports.AcceptAffiliation = 70; //An acceptance of a peace treaty from another alliance.
module.exports.RejectAffiliation = 71; //An acceptance of a peace treaty from another alliance.
module.exports.DisplayGeneralError = 72; //A command to display a generic error on the client, for limited accounts suspected of cheating.

module.exports.PlayerNameTooLong = 73; // Player name exceeds maximum length
module.exports.PlayerNameTooShort = 74; // Player name string is 0 length
module.exports.AlreadyRegistered = 75; // Player's hash already registered

// Dependencies
var net = require('net');
var ByteBuffer = require('bytebuffer');
const { performance } = require('perf_hooks');
const fs = require('fs');

// Imports
const helperFunctions = require('./helperfunctions');
const clientComms = require('./clientComms');
const terminal = require('./terminal');
const game = require('./game');
const config = require('./config');
// const { start } = require('repl');
// Networking

var HOST = '24.131.109.155'; // My server
// var HOST = '71.72.100.217' // Corbin's server
// var HOST = '127.0.0.1'; // Localhost
var PORT = 30069;

// Env.
module.exports.values = {
  deviceHash: helperFunctions.stringToSHA256('owenrossikeen@gmail.com').buffer,
  version: 34,
};

global.globalString = 'test';

const bursting = false; // Some Tobster optimization
var dead = false;
// var authenticated = false;
const tickRate = 1000; //ms

// Instantiation
var client = new net.Socket();

// Variables
const messageSendList = [];

console.log('Dependencies and subordinate libraries loaded!');

var firstTime = true;

module.exports.bytesToSend = bytesToSend = ({ cData }) => {
  if (bursting) return console.log('bytesToSend: bursting enabled'); // Ignore
  if (dead) return console.log('bytesToSend: session dead'); // If socket connection is dead. Not being tracked atm.
  messageSendList.push(cData);
  return;
};
var keepaliveCount = 0;
const tick = () => {
  if (messageSendList.length)
    // terminal.log(`messageSendList: `, 'tick', [...messageSendList]);
    // if (messageSendList.length) console.log('TEAGHAGHAGH', ...messageSendList[0]);

    // This runs every second once the connection is open. It will iterate over messagesSendList and send as many messages as it can before the tick is over with.
    var messagesSent = 0;
  var timeElapsed = 0;
  while (timeElapsed < 999 && messageSendList.length) {
    let startTime = performance.now();
    try {
      client.write(messageSendList[0]);
      messagesSent++;
    } catch (e) {
      terminal.log(e, 'error');
    }
    messageSendList.shift();
    let endTime = performance.now();
    timeElapsed = timeElapsed + (endTime - startTime);
  }
  if (!messagesSent) {
    if (keepaliveCount == 30) {
      // Send keepalive;
      terminal.log('Sending keepAlive', 'code');
      clientComms.sendCommand({ lCommand: this.KeepAlive });
      keepaliveCount = 0;
      return;
    }
    keepaliveCount++;
    return;
  }
  if (messagesSent) {
    terminal.log(`Finished with ${messagesSent} transmission(s).`, 'tick');
    return;
  }
};

const requestConfig = () => {
  if (!global.state.hasConfig) {
    terminal.log('Requesting config', 'code');

    global.state.requestingConfig = true;
    clientComms.requestObject({ lObject: this.Config }); // Requests the server config snapshot - this requires registration AND authentication
  }
};
const authenticated = () => {
  global.state.gameState = 'ready';
  game.authenticated();

  // Tob wants to enable synchronous object handling for the config. I don't have async to begin with so it doesn't matter right now.

  requestConfig();
};
const requestSnapshot = () => {
  if (!global.state.hasGameSnapshot) {
    terminal.log('Requesting game snapshot', 'code');

    global.state.requestingSnapshot = true;
    clientComms.requestObject({ lObject: this.GameSnapshot }); // Requests a game snapshot - this requires registration AND authentication
  }
};

const registerWithServer = () => {
  if (!global.state.registered) {
    terminal.log('Registering', 'code');

    clientComms.register({ strUsername: 'This is a test', lAvatarId: 12 }); // Tries to register a user
    global.state.registering = true;
    // requestConfig();
  }
};

const authenticateClient = () => {
  if (!global.state.authenticated) {
    terminal.log('Authenticating', 'code');
    // Sets 'authenticating' state to true, so that other functions know we're in the process of authenticating.
    global.state.authenticating = true;
    clientComms.authenticate({
      deviceHash: this.values.deviceHash,
      strDeviceName: '',
      strProcessName: '',
      majorVersion: this.values.version,
    });
    return;
  }
  return 'Authenticating';
};

// updateState()
const start = () => {
  var auditProgram = true;
  if (auditProgram) {
    const audit = async () => {
      let result = await helperFunctions.projectAudit();
      terminal.log(result, 'code');
    };
    audit();
  }
  client.connect(PORT, HOST, () => {
    terminal.log(`Client connected to: ${HOST}:${PORT}`, 'networkEvent');
    global.state.dead = false;
    authenticateClient();
    // Server connection is live - now is the time to authenticate
    // registerWithServer(); // This is only needed if the client has not yet been authenticated. This should be a client-side check in the future.
    const serverCycle = setInterval(() => {
      if (global.state.dead) {
        clearInterval(serverCycle);
        terminal.log('Server dead, aborting tick.', 'tick');
        return;
      }
      tick();
    }, tickRate);
  });

  client.on('data', (data) => {
    terminal.log(`Client Received: `, 'networkEvent', data);
    clientComms.processBytes(data);
  });

  client.on('close', () => {
    terminal.log('Client closed', 'networkEvent');
    global.state.dead = true;
  });

  client.on('error', (err) => {
    if (err.errno == -4077) return;
    terminal.log('', 'error', err);
  });
};

module.exports.objectReceived = objectReceived = async ({
  lObject,
  lInstanceNumber,
  lOffset,
  cData,
}) => {
  const bb = new ByteBuffer(cData.length).append(cData).reset();

  var objectType;

  var run;

  switch (lObject) {
    case this.Authorize:
      // console.log(bb);
      const nMajorVersion = bb.readShort();
      const nMinorVersion = bb.readShort();
      const lConfigCheckSum = bb.readInt();
      const lPlayerID = bb.readInt();

      global.state.lPlayerID = lPlayerID;
      game.setOurPlayerId(lPlayerID);
      // Do the same thing as above for the UI module. Probably unnecessary in React.

      // Verify game version.
      if (game.verifyVersion(nMajorVersion, nMinorVersion)) {
        // Check to make sure config is up to date
        if (lConfigCheckSum !== game.getGameConfigChecksum()) {
          // If config is not up to date, fetch it!
          requestConfig();
        }
      }
      objectType = 'Authorized!';
      // Is the client currently in the process of authenticating AND is the client not already authenticated? This check may currently be redundant.
      run = () => {
        if (!global.state.authenticated && global.state.authenticating) {
          global.state.authenticated = true; // Let state know we're authenticated
          global.state.authenticating = false; // Make it clear that we are no longer in the process of authentication
          // requestConfig();
        }
      };
      break;
    case this.Config:
      game.setConfig(config.config(cData));

      objectType = 'Received server config!';

      run = () => {
        if (global.state.requestingConfig) {
          global.state.requestingConfig = false;
          global.state.hasConfig = true;
          requestSnapshot();
        }
      };
      break;
    case this.Player:
      objectType = 'Received player object.';
      break;
    case this.MissileSite:
      objectType = 'Received MissileSite object';
      break;
    case this.Radiation:
      objectType = 'Received Radiation object';
      break;
    case this.Report:
      objectType = 'Received Report object';
      break;
    case this.OreMine:
      objectType = 'Received OreMine object';
      break;
    case this.SamSite:
      objectType = 'Received SAM Site object';
      break;
    case this.Loot:
      objectType = 'Received Loot object';
      break;
    default:
      objectType = undefined;
      break;
  }

  terminal.log(
    objectType || `Unknown object from server. Code: ${lObject}`,
    'serverSays'
  );
  run ? run() : null;
};

module.exports.commandReceived = commandReceived = async ({
  lCommand,
  lInstanceNumber,
}) => {
  var command;

  var run;
  switch (lCommand) {
    case this.AccountUnregistered:
      command = 'Account unregistered!';
      // Attempt to register
      run = () => {
        registerWithServer();
      };
      break;
    case this.AccountCreateSuccess:
      command = 'Account successfully created!';

      run = () => {
        this.registering = false;

        if (!this.authenticated) {
          // If the server had to register prior to authorization, try authorizing again
          authenticateClient();
        }
      };
      break;
    case this.PlayerNameTooLong:
      command = 'Player name too long';
      break;
    case this.AlreadyRegistered:
      command = 'Player hash already registered';
      break;
    case this.PlayerNameTooShort:
      command = 'Player name too short';
      break;
    case this.NameTaken:
      command = 'Username taken';
      break;
    case this.MajorVersionInvalid:
      command = 'Major version update available';
      break;
    case this.SnapshotBegin:
      command = 'Game snapshot beginning';

      run = () => {
        if (global.state.requestingSnapshot) {
          global.state.receivingSnapshot = true;
          global.state.requestingSnapshot = false;
          global.state.hasGameSnapshot = true;
          game.snapshotBegin();
        }
      };
      break;
    case this.SnapshotComplete:
      command = 'Game snapshot complete!';
      break;
    case this.KeepAlive:
      command = 'keepAlive received';
      break;
    default:
      command = undefined;
      break;
  }
  terminal.log(
    command || `Unknown command code from server: ${lCommand}`,
    'serverSays'
  );
  run ? run() : null;
  return;
};

start();
// This is a test