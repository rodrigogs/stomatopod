const low = require('./db');

const list = async () => {
  const db = await low;

  return db.get('watchers').value();
};

module.exports = list;
