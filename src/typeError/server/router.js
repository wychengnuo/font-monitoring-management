const Router = require('koa-router');
const compose = require('koa-compose');

const router = new Router({
    prefix: '/typeError'
});

router
    .get('/', async(ctx, next) => {
        ctx.locals = {
            isTrue: true,
            typeTitle: true
        };
        await next();
    });

module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);