
module.exports = async (ctx, next) => {

    var tmpl = require('./dirame_file')(ctx);

    var result = {};

    var data = ctx.locals;

    result.body = tmpl.viewTemplate(data);

    ctx.body = tmpl.layoutTemplate(result);
    
    if(next !== undefined)
        await next();
};



