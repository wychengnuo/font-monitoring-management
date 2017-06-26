const Handlebars = require('handlebars');
const fs = require('fs');
const papa = require('path');

module.exports = function (ctx) {

    var path = ctx.path,
        tmpl = {},
        viewsPath = '',
        layoutsPath = '';

    /**
     * ctx.err_path 判断报错页面转发
     */

    layoutsPath = papa.join(__dirname, 'src', '/layouts/index.html');

    if (ctx.errLog == 'true') {
        
        viewsPath = papa.join(__dirname, '/src/error/views/', ctx.status + '.html');
        
    } else {

        viewsPath = papa.join(__dirname, 'src', path + '/partials/index.html');
        
    }

    var viewFile = fs.readFileSync(viewsPath, 'utf8');

    var layoutFile = fs.readFileSync(layoutsPath, 'utf8');

    var layoutTemplate = Handlebars.compile(layoutFile);

    var viewTemplate = Handlebars.compile(viewFile);

    tmpl.layoutTemplate = layoutTemplate;

    tmpl.viewTemplate = viewTemplate;

    return tmpl;
};