const Router = require('koa-router');
const compose = require('koa-compose');

const router = new Router();

router
    .get('/', async (ctx, next) => {
        ctx.redirect('/index');
    })    
    .get('/index', async(ctx, next) => {
        ctx.locals = {
            isTrue: true,
            indexTitle: true
        };
        await next();
    });

module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);