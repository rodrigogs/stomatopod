const debug = require('debuggler')();
const MySQLEvents = require('mysql-events');

const {
  MYSQL_HOST: host,
  MYSQL_PORT: port,
  MYSQL_USER: user,
  MYSQL_PASSWORD: password,
} = require('./env');

const options = {
  host,
  port,
  user,
  password,
};

debug('connecting to', `${options.host}:${options.port}`);
const Shrimp = MySQLEvents(options);

module.exports = Shrimp;
