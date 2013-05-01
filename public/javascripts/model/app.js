define(function(require, exports, module){
    var Backbone = require('backbone')
    , _ = require('underscore')
    , config = require('app/config');
   
    var App = Backbone.Model.extend({
        defaults:{
            user: null,
            todolist: null,
            mytodolist: null,
        },
    },{
    });

    _.extend(exports, {
        App: App
    });
});
