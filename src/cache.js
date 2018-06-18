let MEM_STORAGE;

const Cache = {
  /**
   * @return {Promise<void>}
   */
  init: async () => {
    MEM_STORAGE = {};
  },

  /**
   * @param {String} key
   * @return {Promise<Object>}
   */
  get: async (key) => {
    const value = MEM_STORAGE[key];
    return JSON.parse(value);
  },

  /**
   * @param {String} key
   * @param {Object} value
   * @return {Promise<void>}
   */
  set: async (key, value) => {
    MEM_STORAGE[key] = JSON.stringify(value);
  },

  /**
   * @param {String} key
   * @return {Promise<void>}
   */
  remove: async (key) => {
    delete MEM_STORAGE[key];
  },
};

module.exports = Cache;
