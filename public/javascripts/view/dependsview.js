define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore');


    exports.DependsView = Backbone.View.extend({
        tagName: 'li',
        model: null,
        
        events:{
        },
        initialize: function(){
            this.templateObj = new jSmart(this.options.template);
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change:done', this.informDone);
        },
        informDone: function(){
            this.collection.trigger('complete:depends');
        },
        render: function(){
            this.$el.html(
                this.templateObj.fetch({
                    model: this.model.toJSON()
                }));
            return this;
        },
    });
});
