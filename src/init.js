const debug = require('debuggler')();
const low = require('./db');
const watch = require('./watch');

const init = async () => {
  const db = await low;
  await db
    .defaults({
      watchers: [],
    })
    .write();

  const watchers = await db
    .get('watchers')
    .value();

  if (!watchers) return;

  return Promise.all(watchers.map(async (watcher) => {
    if (!watcher.destinations) return;

    return Promise.all(watcher.destinations.map(async (destination) => {
      debug('initializing watcher for expression', watcher.expression, 'destination', destination);

      // await watch(watcher.expression, destination);
    }));
  }));
};

module.exports = init;
