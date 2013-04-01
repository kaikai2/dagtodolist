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
    },
    map:{
	"*": {
	    'smart': 'smart-2.9.min',
	},
    },
    shim: {
	underscore: {exports: '_'},
	backbone: {deps:["underscore", "jquery"], exports: "Backbone"},
        bootstrap: {deps: ["jquery"]},
    }
});
requirejs(['underscore', 'smart-2.9.min'], function(_,s){
    console.log('undersocre loaded');
    console.log('smart loaded');
});
define(function(require, exports, module) {
    var $ = require('jquery')
    , _ = require('underscore')
    , backbone = require('backbone')
    , test = require('app/pages/test')
    , SideBarView = require('view/sidebar').SideBarView
    , MyTodoListView = require('view/mytodolist').MyTodoListView
    , App = require('model/app').App
    , Task = require('model/task').Task
    , Tasks = require('model/task').Tasks
    , config = require('app/config');

    var app = new App({
        mytodolist: new Tasks({}),
    });
    var sidebar = new SideBarView({
        el: $("#sideBar"),
        model: app
    });
    var mytodolist = new MyTodoListView({
        el: $("#mylist"),
        collection: app.get('mytodolist'),
    });

});

