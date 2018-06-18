const Router = require('koa-router');
const watch = require('./watch');
const unwatch = require('./unwatch');
const list = require('./list');

const router = new Router();

/**
 */
router.get('/', async (ctx) => {
  const watchers = await list();

  ctx.status = 200;
  ctx.body = watchers;
});

/**
 */
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

/**
 */
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

module.exports = router;
