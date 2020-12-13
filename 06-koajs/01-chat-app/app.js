const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const clients = new Set();

router.get('/subscribe', async (ctx, next) => {
    const msg = await new Promise(resolve => clients.add(resolve));
    ctx.body = msg;
});

router.post('/publish', async (ctx, next) => {
    const msg = ctx.request.body.message;

    if (!msg) {
        ctx.throw(400);
    }

    clients.forEach(resolve => resolve(msg));
    clients.clear();
    ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
