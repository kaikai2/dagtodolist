requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'javascripts/lib',
    
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
	app: '../app',
	view: '../view',
	model: '../model',
	async: 'require.async',
        template: '../../template',
        anim: '../anim',
        raphael: 'raphael',
    },
    map:{
	"*": {
	    'smart': 'smart-2.9.min',
            //'raphael': 'raphael.amd',
	},
    },
    shim: {
	underscore: {exports: '_'},
	backbone: {deps:["underscore", "jquery"], exports: "Backbone"},
        bootstrap: {deps: ["jquery"]},
        //eve: {deps: ["jquery"], exports: 'eve'},
        raphael: {deps: ["jquery"], exports: 'Raphael'},
    }
});
requirejs(['underscore', 'smart', 'raphael'], function(_,s){
    console.log('undersocre loaded');
    console.log('smart loaded');
    console.log('raphael loaded');
});
define(function(require, exports, module) {
    var $ = require('jquery')
    , _ = require('underscore')
    , Backbone = require('backbone')
    , test = require('app/pages/test')
    , SideBarView = require('view/sidebar').SideBarView
    , MyTodoListView = require('view/mytodolist').MyTodoListView
    , TodoFlowView = require('view/todoflow').TodoFlowView
    , LoginDialog = require('view/logindialog').LoginDialog
    , App = require('model/app').App
    , User = require('model/user').User
    , Task = require('model/task').Task
    , Tasks = require('model/task').Tasks
    , config = require('app/config');


    var app = new App({
        mytodolist: new Tasks(),
        user: new User(),
    });
    var sidebar = new SideBarView({
        el: $("#sideBar"),
        model: app
    });

    var mytodolist = new MyTodoListView({
        el: $("#mylist"),
        collection: app.get('mytodolist'),
    });
    var todoflow = new TodoFlowView({
        el: $("#taskflow"),
        collection: app.get('mytodolist'),
    });
    var Workspace = Backbone.Router.extend({
        routes: {
            "login": "login",
            "logout": "logout",
            "todolist": "todolist",
            "*page": "check",
        },
        
        login: function(){
            var loginDialog = new LoginDialog({
                el: $("#loginDialog"),
                model: app.get('user'),
            });
        },
        logout: function(){
            var router = this;
            app.get('user').logout(function(){
                router.navigate("login", {trigger: true});
            });
        },

        check: function(page){
            var router = this;
            app.get('user').checkLogin(function(err, login){
                if (err){
                    console.log(err);
                    return;
                }

                if (!login){
                    router.navigate("login", {trigger: true});
                }else{
                    router.navigate("todolist", {trigger: true});
                }
            });
        },
        todolist: function(){
            $("#username").text(app.get('user').get('name'));
            app.get('mytodolist').fetch({add:true});
        },
    });
    var router = new Workspace();
    Backbone.history.start();
});

