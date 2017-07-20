const Router = require('koa-router');
const compose = require('koa-compose');
const router = Router();


router
    .get('/plugAndir', async (ctx, next) => {
        ctx.locals = {
            isTrue: true,
            plugTitle: true
        };
        await next();
    }).get('/plugAndir/list', async (ctx, next) => {
        ctx.locals = {
            isTrue: true,
            plugTitle: true,
            title: ctx.query.account
        };
        await next();
    }).get('/plugAndir/listInfo', async (ctx, next) => {
        ctx.locals = {
            isTrue: true,
            plugTitle: true,
            data: '插件详情'
        };
        await next();
    });

module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);