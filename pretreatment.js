
module.exports = async (ctx, next) => {

    const tmpl = require('./dirame_file')(ctx);

    const result = {};
    result.body = tmpl.viewTemplate(ctx.locals);
    result.data = ctx.locals;
    
    ctx.body = tmpl.layoutTemplate(result);
 
    if(next !== undefined)
        await next();
};



