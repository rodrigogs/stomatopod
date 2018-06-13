const debug = require('debuggler')();
const MySQLEvents = require('mysql-events');

const options = {
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
};

debug('connecting to mysql using config', options);

const eventWatcher = MySQLEvents(options);

debug('adding watcher for expression', process.env.WATCH);

eventWatcher.add(
  process.env.WATCH,
  (oldRow, newRow, event) => {
    console.log('oldRow', oldRow);
    console.log('newRow', newRow);
    console.log('event', event);
  },
);
