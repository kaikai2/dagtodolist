define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , _ = require('underscore');

    var ListViewBase = Backbone.View.extend({
        el: null,
        collection: null,
        templateObj: null,
        events:{
        },
        initialize: function(){
            this.views = [];
            this.ItemView = this.options.ItemView;
            this.listenTo(this.collection, 'change', this.filterOne);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'remove', this.onRemove);
            this.listenTo(this.collection, 'all', this.render);
            this.listenTo(this.collection, 'reset', this.addAll);
            this.addAll();
        },
        addOne: function(model){
            var view = new this.ItemView({
                model: model,
                collection: this.collection,
                listoptions: this.options.options,
            });
            this.views.push(view);
            return view;
        },
        addAll: function(){
            this._removeViews();
            this.collection.each(this.addOne, this);
        },
        filterOne: function(model){
            model.trigger('visible');
        },
        filterAll: function(){
            this.collection.each(this.filterOne, this);
        },
        render: function(){
        },
        onRemove: function(){
            var collection = this.collection;
            this.views = _.filter(this.views, function(view){
                if (!collection.get(view.model.id)){
                    view.remove();
                    return false;
                }
                return true;
            });
        },
        fire: function(eventName){
            var args = arguments;
            this.collection.each(function(model){
                model.trigger.apply(model, args);
                //model.trigger(eventName);
            }, this);
        },
        _removeViews: function(){
            _.each(this.views, function(view){view.remove();});
            this.views.length = 0;
        },
        remove: function(){
            this._removeViews();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
    exports.ListViewBase = ListViewBase;

    exports.ListView = ListViewBase.extend({
        events:{
        },
        addOne: function(model){
            var view = ListViewBase.prototype.addOne.apply(this, arguments);
            this.$el.append(view.render().el);
            return view;
        },
        addAll: function(){
            this.$el.html('');
            ListViewBase.prototype.addAll.apply(this, arguments);
        },
        remove: function(){
            ListViewBase.prototype.remove.apply(this, arguments);
        }
    });
});