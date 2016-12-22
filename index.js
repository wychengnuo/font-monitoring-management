const koa = require('koa');
const app = new koa();

const router = require('./router');


// var env = process.env.NODE_ENV || 'production';
// app.locals.ENV = env;
// app.locals.ENV_DEVELOPMENT = env == 'test';



app.use(router());

app.use(async(ctx, next) => {
  try {
    await next(); // next is now a function
  } catch (err) {
    ctx.body = {
      message: err.message
    };
    ctx.status = err.status || 500;
  }
});


app.use(require('./pretreatment'));

app.listen(3000);