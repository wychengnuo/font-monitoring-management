const koa = require('koa');
const app = new koa();
const router = require('./router');
const convert = require('koa-convert');
const statics = require('koa-static');
const proxy = require('koa-proxy2');


app.use(router());

app.use(proxy({
    proxy_rules: [
        {
            proxy_location: /plugin/,
            // proxy_pass: 'http://127.0.0.1:3002',
            // proxy_pass: 'http://10.134.94.146:3002',//chenze
            proxy_pass: 'http://10.134.94.43:3002',//wangyan
            proxy_micro_service: false,
            proxy_merge_mode: false
        }
    ]
}));

app.use(convert(statics((__dirname + '/src/public/'))));
app.use(require('./pretreatment'));


app.use(async(ctx, next) => {

    try {
        await next(); // next is now a function
    } catch (err) {
        ctx.locals = {};
        ctx.status = err.status || ctx.res.statusCode || 500;
        ctx.errLog = 'true';
        require('./pretreatment')(ctx);  
    }
});




var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('http://%s:%s', host, port, ',启动成功');
});