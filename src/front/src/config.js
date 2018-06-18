module.exports = (Vue) => {
  Vue.http.options.root = `${process.env.HOST}:${process.env.PORT}/api`;
};
