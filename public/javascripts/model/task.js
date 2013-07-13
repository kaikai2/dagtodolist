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
            this.save();
        },
        isHidden: function(filter){
            var model = this;
            var textFilter = filter.findWhere({type: 'text'});
            if (!textFilter.get('filte').call(textFilter, model))
                return true;
            return !_.any(filter.where({selected: true}), function(f){
                var filteFunc = f.get('filte');
                return filteFunc.call(f, model);
            });
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
        },
        isDependOn: function(model1, model2){
            var ids = _.object(model1.get('depends'), true);
            return model2.id in ids;
        },
    });
    _.extend(exports, {
        Task: Task,
        Tasks: Tasks,
    });
});
