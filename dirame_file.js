const Handlebars = require('handlebars');
const fs = require('fs');
const papa = require('path');

module.exports = function (ctx) {

    let path = ctx.path,
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
        let vp = ctx.path.replace(/^(?!{-})\//, '').split('/');

        if (vp.length > 1) {
            viewsPath = papa.join(__dirname, 'src/', vp[0] + '/partials/' + vp[1] + '/index.html');
        } else {
            viewsPath = papa.join(__dirname, 'src', path + '/partials/index.html');
        }
    }

    /**
     * 使用Handlebars.compile 解析页面
     */

    const isTrue = isFile(viewsPath);

    if (!isTrue) {
        let status = 404;
        viewsPath = papa.join(__dirname, '/src/error/views/', status + '.html');
    }

    const viewFile = fs.readFileSync(viewsPath, 'utf8');

    const layoutFile = fs.readFileSync(layoutsPath, 'utf8');

    const layoutTemplate = Handlebars.compile(layoutFile);

    const viewTemplate = Handlebars.compile(viewFile);

    tmpl.layoutTemplate = layoutTemplate;

    tmpl.viewTemplate = viewTemplate;

    return tmpl;
};


const isFile = (path) => {
    let is;
    return fs.existsSync(path, function (exists) {
        if (exists) {
            is = true;
        } else {
            is = false;
        }
    });
    // return is;
};