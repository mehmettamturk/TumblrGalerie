var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var tumblr = require('tumblr.js');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

var configFile = require('optimist').default('config', require('path').join(__dirname + '/', 'config.ini')).argv['config'];
GLOBAL.config = require('ini').parse(require('fs').readFileSync(configFile, 'utf-8'));

var client = tumblr.createClient({
    consumer_key: GLOBAL.config.consumer_key,
    consumer_secret: GLOBAL.config.consumer_secret,
    token: GLOBAL.config.token,
    token_secret: GLOBAL.config.token_secret
});

app.get('/getData/:blogName', function(req, res) {
    console.log(req.params);
    var blogName = req.params.blogName + '.tumblr.com';
    if (req.params.blogName.indexOf('tumblr.com') > -1)
        blogName = req.params.blogName;

    client.posts(blogName, { type: 'photo', limit: 20}, function (err, data) {
        res.send({
            data: data,
            err: err
        });
    });
});

app.get('/getData/:searchKey', function(req, res) {
    client.tagged(req.params.searchKey, function (err, data) {
        res.send(data);
    });
});


module.exports = app;

