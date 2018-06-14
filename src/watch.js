const debug = require('debuggler')();
const low = require('./db');
const Shrimp = require('./shrimp');
const Cache = require('./cache');
const axios = require('axios');

const watch = async (expression, destination) => {
  if (!expression || !destination) {
    const err = new Error('Bad Request');
    err.status = 400;
    throw err;
  }

  const db = await low;

  debug(
    'adding watcher for expression', expression,
    'for destination', destination,
  );

  let watcher = await db.get('watchers').find({ expression }).value();
  if (watcher) {
    debug('watcher already exists for expression', expression);

    const hasDest = watcher.destinations.indexOf(destination) !== -1;
    if (hasDest) {
      debug('watcher already has destination', destination);
      return watcher;
    }

    debug('adding destination', destination, 'for watcher');
    watcher = await db.get('watchers')
      .find({ expression })
      .update('destinations', dests => dests.push(destination))
      .write();

    return watcher;
  }

  debug('creating watcher');
  watcher = await db
    .get('watchers')
    .push({ expression, destinations: [destination] })
    .find({ expression })
    .write();

  Cache.set(expression, JSON.stringify(watcher));

  Shrimp.add(expression, async (oldRow, newRow, event) => {
    const watcher = JSON.parse(Cache.get(expression));
    if (!watcher) return debug('found orphan watcher for expression', expression);

    await Promise.all(watcher.destinations.map(async (dest) => {
      axios.post(dest, {
        oldRow,
        newRow,
        event,
      });
    }));
  });

  return watcher;
};

module.exports = watch;
