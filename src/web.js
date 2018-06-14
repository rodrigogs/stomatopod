const debug = require('debuggler')();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const watch = require('./watch');
const unwatch = require('./unwatch');
const init = require('./init');

const Application = async () => {
  debug('bootstrapping application');

  await init();

  const app = new Koa();
  const router = new Router();

  app.use(bodyParser({
    jsonLimit: '10mb',
  }));

  router.post('/watch', async (ctx) => {
    const {
      expression,
      destination,
    } = ctx.request.body;

    const watcher = await watch(expression, destination);
    if (!watcher) {
      ctx.status = 204;
      return;
    }

    ctx.status = 200;
    ctx.body = watcher;
  });

  router.post('/unwatch', async (ctx) => {
    const {
      expression,
      destination,
    } = ctx.request.body;

    const watcher = await unwatch(expression, destination);
    if (!watcher) {
      ctx.status = 204;
      return;
    }

    ctx.status = 200;
    ctx.body = watcher;
  });

  app.use(router.routes(), router.allowedMethods());

  return app;
};

module.exports = Application;
