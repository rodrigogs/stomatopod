const debug = require('debuggler')();

const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const serve = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const init = require('./init');
const apiRouter = require('./api');

/**
 * @return {Promise<Koa>}
 */
const bootstrap = async () => {
  debug('bootstrapping application');

  await init();

  const app = new Koa();
  const router = new Router();
  const socket = require('./socket');

  app.use(mount('/', serve(path.join(__dirname, 'front'))));

  app.use(cors());
  app.use(bodyParser({
    jsonLimit: '10mb',
  }));

  router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

  app.use(router.routes(), router.allowedMethods());

  socket.attach(app);

  return app;
};

module.exports = bootstrap;
