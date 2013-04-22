define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , _ = require('underscore');

    exports.ListView = Backbone.View.extend({
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
//            this.templateObj = new jSmart(this.options.template);
            this.addAll();
        },
        addOne: function(model){
            var view = new this.ItemView({
                model: model,
                template: this.options.itemTemplate,
                collection: this.collection,
                listoptions: this.options.options,
            });
            this.$el.append(view.render().el);
            this.views.push(view);
        },
        addAll: function(){
            this._removeViews();
            this.$el.html('');
            this.collection.each(this.addOne, this);
        },
        filterOne: function(model){
            model.trigger('visible');
        },
        filterAll: function(){
            this.collection.each(this.filterOne, this);
        },
        render: function(){
            /*this.$el.children('ul').html('');
            var self = this;
            this.collection.forEach(function(item){
                self.onAdd(item);
            });*/
            //this.$el.children('ul').listview('refresh');
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
            this.collection.each(function(model){
                model.trigger(eventName);
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
});