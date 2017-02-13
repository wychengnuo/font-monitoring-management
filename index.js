const koa = require('koa');
const app = new koa();
const path = require('path');
const router = require('./router');

app.use(router());

app.use(async (ctx, next) => {
  
    try {
        await next(); // next is now a function
    } catch (err) {
        
        ctx.locals = {};
        ctx.status = err.status || ctx.res.statusCode || 500;
        ctx.errLog = 'true';

        require('./pretreatment')(ctx);
    }
});


app.use(require('./pretreatment'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('http://%s:%s', host, port, ',启动成功');
});