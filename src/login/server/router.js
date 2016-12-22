const Router = require('koa-router');
const compose = require('koa-compose');

const router = new Router({
    prefix: '/login'
});

router
    .get('/', async (ctx, next) => {
        ctx.locals = {
            name: "lalala"
        }
        await next();
    });

module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);