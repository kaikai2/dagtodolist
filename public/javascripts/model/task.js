define(function(require, exports, module){
    var Backbone = require('backbone')
    , _ = require('underscore')
    , config = require('app/config');
   
    var Task = Backbone.Model.extend({
        urlRoot: '/todo',
        idAttribute: "_id",
        initialize: function(){
            console.log(0);
        },
        defaults:{
            name: null,
            done: false,
            ready: true,
            depends: [],
            begin: null,
            //...
        },
        toggle: function(){
            this.set('done', !this.get('done'));
        },
    },{
    });
    var Tasks = Backbone.Collection.extend({
        model: Task,
        url: '/todo',
    });
    _.extend(exports, {
        Task: Task,
        Tasks: Tasks,
    });
});
