const glob = require('glob');
const path = require('path');
const compose = require('koa-compose');

let routers = [];

glob
  .sync(`${__dirname}/src/**/router.js`)
  .filter((file) => (process.env.NODE_ENV !== 'production') || (path.dirname(file).indexOf('test') !== -1))
  .forEach((file) => {
      try {
          if (typeof require(file)() === 'function')
              routers.push(require(file)());
      } catch (error) {
          console.log(error);
      }
  });

module.exports = () => compose(routers);