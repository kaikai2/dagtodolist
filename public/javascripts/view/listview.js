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
            this.ItemView = this.options.ItemView;
            this.listenTo(this.collection, 'change', this.filterOne);
            this.listenTo(this.collection, 'add', this.addOne);
//            this.listenTo(this.collection, 'remove', this.onRemove);
            this.listenTo(this.collection, 'all', this.render);
            this.listenTo(this.collection, 'reset', this.addAll);
//            this.templateObj = new jSmart(this.options.template);
        },
        addOne: function(model){
            var view = new this.ItemView({
                model: model,
                template: this.options.itemTemplate,
                collection: this.collection,
            });
            this.$el.append(view.render().el);
        },
        addAll: function(){
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

    });
});