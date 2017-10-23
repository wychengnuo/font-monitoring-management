const Router = require('koa-router');
const compose = require('koa-compose');

const router = new Router();

router
    .get('/docs', async (ctx, next) => {
        ctx.locals = {
            isTrue: false
        };
        await next();
    });
module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);