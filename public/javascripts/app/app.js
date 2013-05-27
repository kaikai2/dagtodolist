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
    var loginDialog = new LoginDialog({
        el: $("#loginDialog"),
        model: app.get('user'),
    });
    var Workspace = Backbone.Router.extend({
        routes: {
            "login": "login",
            "logout": "logout",
            "todolist": "todolist",
            "*page": "check",
        },
        
        login: function(){
            loginDialog.show();
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
            if (app.get('user').get('name') == null){
                router.navigate("check", {trigger: true});
                return;
            }
            $("#username").text(app.get('user').get('name'));
            app.get('mytodolist').fetch({add:true});
        },
    });
    var router = new Workspace();
    Backbone.history.start();
});
