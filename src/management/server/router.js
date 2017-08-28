const Router = require('koa-router');
const compose = require('koa-compose');

const router = new Router();

router
    .get('/management', async (ctx, next) => {
        ctx.locals = {
            isTrue: false
        };
        await next();
    });

    switch (key) {
        case value:
            
            break;
    
        default:
            break;
    }

module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);