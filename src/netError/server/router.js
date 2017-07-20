const Router = require('koa-router');
const compose = require('koa-compose');

const router = new Router({
    prefix: '/netError'
});

router
    .get('/', async (ctx, next) => {
        ctx.locals = {
            isTrue: true,
            netTitle: true
        };
        await next();
    });

module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);