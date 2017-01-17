
const Handlebars = require('handlebars');
const fs = require('fs');

module.exports = function (ctx) {
    
    var path = ctx.path, tmpl = {}, viewsPath = '', layoutsPath = '';


    /**
     * ctx.err_path 判断报错页面转发
     */

    if (ctx.err_path) {

        layoutsPath = ctx.err_pub_path + '/login/views/layouts/index.html';

        viewsPath = ctx.err_path + ctx.status + '.html';
        
    } else {

        layoutsPath = path + '/views/layouts/index.html';

        viewsPath = path + '/partials/index.html';

    }

    var viewFile = fs.readFileSync(viewsPath, 'utf8');

    var layoutFile = fs.readFileSync(layoutsPath, 'utf8');

    var layoutTemplate = Handlebars.compile(layoutFile);

    var viewTemplate = Handlebars.compile(viewFile);
    
    tmpl.layoutTemplate = layoutTemplate;

    tmpl.viewTemplate = viewTemplate;

    return tmpl;
};