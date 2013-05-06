define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , _ = require('underscore');

    exports.SideBarView = Backbone.View.extend({
        el: null,
        model: null,
        collection: null,
        templateObj: null,
        events:{
            "click #newTask": "onNewTask",
            "keypress #newTask": "newOnEnter",
            "shown a[data-toggle=tab]": "onTabShown",
            //"click #maintab a": "onTab",
        },
        initialize: function(){
            this.templateObj = new jSmart(this.options.template);
            //this.$el.find("#maintab :first").tab("show");
            this.$input = this.$("#newTask");
        },
        
        render: function(){
        },

        // events
        onNewTask: function(){
            
            //this.model.
        },
        newOnEnter: function(){
            if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
                return;
            }
            
            this.$input.val('');
        },

        onTab: function(e){
            e.preventDefault();
            $(e.target).tab('show');
        },
        onTabShown: function(e){
            e.target.trigger("shown");
        },
    });
});