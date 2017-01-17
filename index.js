const koa = require('koa');
const app = new koa();
const path = require('path');
const router = require('./router');


// var env = process.env.NODE_ENV || 'production';
// app.locals.ENV = env;
// app.locals.ENV_DEVELOPMENT = env == 'test';

app.use(router());

app.use(async (ctx, next) => {
  
  try {

    await next(); // next is now a function

  } catch (err) {
    ctx.locals = {};
    ctx.status = err.status || ctx.res.statusCode || 500;
    
    ctx.err_path = path.join(__dirname, '/src/error/views/');
    ctx.err_pub_path = path.join(__dirname, '/src');
    // ctx.locals = {   //本身的报错信息，可以不传，走自定义
    //         message: err.message
    // };  
    require('./pretreatment')(ctx);
  }
});


app.use(require('./pretreatment'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("http://%s:%s", host, port, ',启动成功');
});