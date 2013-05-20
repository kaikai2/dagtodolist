
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, restful = require('./lib/restful')
, mongoose = require('mongoose')
, path = require('path');

// 数据库配置信息
var db_name = 'dagtodolist';                // 数据库名，你自己的数据库名（可从管理中心查看到）
var db_host =  'localhost';    // 数据库地址
var db_port =  27017;  		// 数据库端口
var username = '';               // 用户名
var password = '';               // 密码
var mongodbUrl = ["mongodb://", username, ':', password, '@', db_host, ":", db_port, "/", db_name].join('');
var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.engine('html', require('ejs').renderFile);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.cookieSession({secret: 'dog.1'}));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/user/check', user.checkSession);
app.get('/user/login', user.login);
app.get('/user/logout', user.logout);
restful.route(app, '/user', [], user);
restful.route(app, '/todo', [], require('./routes/todo'));

mongoose.connect(mongodbUrl);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
