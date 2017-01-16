module.exports = function (ctx, fs, Handlebars) {

    var path = __dirname + '/src' + ctx.req.url;

    var tmpl = {};

    var layoutsPath = path + '/views/layouts/index.html';

    var viewsPath = path + '/partials/index.html';

    var viewFile = fs.readFileSync(viewsPath, 'utf8');

    var layoutFile = fs.readFileSync(layoutsPath, 'utf8');

    var layoutTemplate = Handlebars.compile(layoutFile);

    var viewTemplate = Handlebars.compile(viewFile);

    tmpl.layoutTemplate = layoutTemplate;

    tmpl.viewTemplate = viewTemplate;

    return tmpl;
};