const Router = require('koa-router');
const compose = require('koa-compose');
const router = Router();

router
    .get('/messagePush', async (ctx, next) => {
        ctx.locals = {
            isTrue: true,
            messagePushTitle: true
        };
        await next();
    });

module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);