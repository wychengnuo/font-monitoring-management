const Router = require('koa-router');
const compose = require('koa-compose');
const router = Router();

const { host } = require('./../../config/default');



const os = require('os');

const networkInterfaces = os.networkInterfaces();
const eth0 = (networkInterfaces['WLAN']  || networkInterfaces.eth0 || networkInterfaces.en0).filter(i=> i.family === 'IPv4');


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
            data: '插件详情',
            path: 'http://' + (host || (eth0[0].address + ':3002')) + '/plugin/api/setPlugListInfo'
        };
        await next();
    });

module.exports = () => compose([
    router.routes(),
    router.allowedMethods()
]);