define(function(require, exports, module) {
    var $ = require('jquery');
    //var User = require('model/user').User;
    //var UserEvents = require('model/userevent').UserEvents;
    var Backbone = require('backbone');
    //var template = require('text!template/userinfo.tpl');
    var config = require('app/config');

    var TestPage = Backbone.View.extend({
        el: '#testPage',
        events:{
            "submit form#todo": "submit_todo",
        },
        initialize: function(){
        },
        submit_todo: function(e){
            e.preventDefault();
            e.stopPropagation();
            $.getJSON('todo', {}, function(json){
                console.log(json); 
            });
        },
    });

    var page = new TestPage({
        el: '#testPage',
    });
});