
const Handlebars = require('handlebars');
const fs = require('fs');

module.exports = async (ctx, next) => {

    var tmpl = require('./dirame_file')(ctx, fs, Handlebars);

    var result = {};

    var data = ctx.locals;

    result.body = tmpl.viewTemplate(data);

    ctx.body = tmpl.layoutTemplate(result);
    
    await next();

};



