const koa = require('koa');
const app = new koa();
const path = require('path');
const router = require('./router');


// var env = process.env.NODE_ENV || 'production';
// app.locals.ENV = env;
// app.locals.ENV_DEVELOPMENT = env == 'test';



app.use(router());

app.use(async(ctx, next) => {
  try {
    await next(); // next is now a function
  } catch (err) {
    //console.log(ctx);
    ctx.body = {
      message: err.message
    };
    //ctx.locals.viewFile = path.join('error/views/',err.status + '');
    ctx.status = err.status || 500;
  }
});


app.use(require('./pretreatment'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("http://%s:%s", host, port, ',启动成功');
});