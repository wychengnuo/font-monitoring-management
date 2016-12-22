
const Handlebars = require('handlebars');
const fs = require('fs');

module.exports = async (ctx, next) => {
    
    var layoutsPath = __dirname + '/src' + ctx.req.url + '/views/layouts/index.html';

    var viewsPath = __dirname + '/src' + ctx.req.url + '/partials/index.html';

    var viewFile = fs.readFileSync(viewsPath, "utf8");

    var layoutFile = fs.readFileSync(layoutsPath, "utf8");

    var layoutTemplate = Handlebars.compile(layoutFile);

    var viewTemplate = Handlebars.compile(viewFile);

    var result = {};

    var data = '';

    result.body = viewTemplate(ctx.locals);

    ctx.body = layoutTemplate(result);
    
    await next();

};



