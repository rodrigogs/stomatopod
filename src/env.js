const path = require('path');

/**
 * @see https://github.com/motdotla/dotenv#usage
 */
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.process.env.test') });
} if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__filename, '../../.env') });
}

class Env {
  /**
   * @default 'development'
   * @return {String}
   */
  static get NODE_ENV() {
    return process.env.NODE_ENV || 'development';
  }

  /**
   * @default 3000
   * @return {Number}
   */
  static get PORT() {
    return process.env.PORT || 3000;
  }

  /**
   * @default 'localhost'
   * @return {String}
   */
  static get MYSQL_HOST() {
    return process.env.MYSQL_HOST || 'localhost';
  }

  /**
   * @default 3306
   * @return {Number}
   */
  static get MYSQL_PORT() {
    return process.env.MYSQL_PORT || 3306;
  }

  /**
   * @return {String}
   */
  static get MYSQL_USER() {
    return process.env.MYSQL_USER;
  }

  /**
   * @return {String}
   */
  static get MYSQL_PASSWORD() {
    return process.env.MYSQL_PASSWORD;
  }
}

module.exports = Env;
