const debug = require('debuggler')();
const low = require('./db');
const Shrimp = require('./shrimp');
const Cache = require('./cache');
const axios = require('axios');
const socket = require('./socket');

const WATCHING_EXPRESSIONS = [];

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
      await Cache.set(expression, watcher);
    } else {
      debug('adding destination', destination, 'for watcher');
      watcher = await db.get('watchers')
        .find({ expression })
        .update('destinations', dests => dests.push(destination))
        .write();
    }
  } else {
    debug('creating watcher');
    watcher = await db
      .get('watchers')
      .push({ expression, destinations: [destination] })
      .find({ expression })
      .write();

    await Cache.set(expression, watcher);
  }

  if (WATCHING_EXPRESSIONS.indexOf(expression) !== -1) return watcher;

  Shrimp.add(expression, async (oldRow, newRow, event) => {
    debug('caught event for expression', expression);

    const watcher = await Cache.get(expression);
    if (!watcher) return debug('found orphan watcher for expression', expression);

    await Promise.all(watcher.destinations.map(async (dest) => {
      socket.broadcast('request', { destination: dest, expression });

      axios.post(dest, {
        oldRow,
        newRow,
        event,
      })
        .then(() => {
          debug('succeeded', expression, destination);
        })
        .catch(() => {
          debug('failed', expression, destination);
        });
    }));
  });

  WATCHING_EXPRESSIONS.push(expression);

  return watcher;
};

module.exports = watch;
