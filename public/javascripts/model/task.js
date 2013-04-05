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
        sync: function(method, model, options){
            if (method == "read"){
                
            }
            Backbone.sync.apply(this, arguments);
        },
        depends: function(model){
            var ids = _.object(model.get('depends'), true);
            return new Tasks(this.filter(function(m){
                return m.id in ids;
            }));
        }
    });
    _.extend(exports, {
        Task: Task,
        Tasks: Tasks,
    });
});
