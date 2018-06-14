const debug = require('debuggler')();
const low = require('./db');
const Shrimp = require('./shrimp');
const Cache = require('./cache');

const unwatch = async (expression, destination) => {
  if (!expression) {
    const err = new Error('Bad Request');
    err.status = 400;
    throw err;
  }

  const db = await low;

  debug(
    'removing watcher for expression', expression,
    'for destination', destination,
  );

  if (!destination) {
    await db.get('watchers').remove({ expression }).write();
    Shrimp.remove(expression);
    Cache.set(expression, undefined);
    return;
  }

  let watcher = await db.get('watchers').find({ expression }).value();
  if (watcher) {
    debug('watcher exists for expression', expression);

    const index = watcher.destinations.indexOf(destination);
    if (index === -1) {
      const err = new Error(`Destination ${destination} is not registered for watcher ${expression}`);
      err.status = 404;
      throw err;
    }

    watcher = await db.get('watchers')
      .find({ expression })
      .update('destinations', (dests) => {
        dests.splice(index, 1);
        return dests;
      })
      .write();

    debug('removed destination', destination, 'for watcher');

    if (watcher.destinations.length === 0) {
      debug('no remaining destinations for watcher with expression', expression);
      await db.get('watchers')
        .remove({ expression })
        .write();

      return;
    }

    Cache.set(expression, watcher);
    return watcher;
  }

  await db.get('watchers').remove({ expression }).write();
  Shrimp.remove(expression);
  Cache.set(expression, undefined);
};

module.exports = unwatch;
