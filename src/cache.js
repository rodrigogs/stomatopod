const MEM_STORAGE = {};

const Cache = {
  get: key => MEM_STORAGE[key],

  set: (key, value) => {
    MEM_STORAGE[key] = value;
  },
};

module.exports = Cache;
