const debug = require('debuggler')();

const os = require('os');
const fs = require('fs');
const path = require('path');
const low = require('lowdb');
const mkdirp = require('mkdirp');
const FileAsync = require('lowdb/adapters/FileAsync');

const dbDir = path.join(os.homedir(), 'stomatopod');
const dbFile = path.join(dbDir, 'db.json');

if (!fs.existsSync(dbDir)) {
  debug('creating directory', dbDir);
  mkdirp.sync(dbDir);
}

debug('initiating lowdb on', dbFile);
const adapter = new FileAsync(dbFile);
const db = low(adapter);

module.exports = db;
