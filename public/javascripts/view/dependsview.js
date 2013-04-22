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
            "click .remove": "removeDepends",
        },
        initialize: function(){
            this.templateObj = new jSmart(this.options.listoptions.template);
            this.listenTo(this.model, 'change:name', this.render);
            this.listenTo(this.model, 'change:done change:ready', this.updateState);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change:done', this.informDone);
        },
        informDone: function(){
            this.collection.trigger('complete:depends');
        },
        updateState: function(){
            if (this.model.get('ready')){
                this.$(".state").addClass("ready");
            }else{
                this.$(".state").removeClass("ready");
            }
            if (this.model.get('done')){
                this.$(".state").addClass("done");
            }else{
                this.$(".state").removeClass("done");
            }
        },
        render: function(){
            this.$el.html(
                this.templateObj.fetch({
                    model: this.model.toJSON()
                }));
            return this;
        },

        // event handler
        removeDepends: function(){
            this.collection.remove(this.model);
        },
    });
});
