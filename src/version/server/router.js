const Router = require('koa-router');
const compose = require('koa-compose');

const router = new Router({
    prefix: '/version'
});

router
    .get('/', async(ctx, next) => {
        ctx.locals = {
            isTrue: true,
            vserTitle: true
        };
        await next();
    });

module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);