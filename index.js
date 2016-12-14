
const koa = require('koa');
const app = new koa();

//const router = require('./router');
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';


const handlebars = require('handlebars');  

app.use(async (ctx, next) => {
  try {
    await next(); // next is now a function
  } catch (err) {
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
  }
});



app.use(async (ctx, next) => {



 ctx.body = "asfsadf"

  await next();
});

app.listen(3000);