
const koa = require('koa');
const app = new koa();

const router = require('./router');


app.use(async (ctx, next) => {

  ctx.body = 'Hello World';
  await next();
});

app.listen(3000);