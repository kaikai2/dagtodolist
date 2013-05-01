define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , Raphael = require('raphael.amd')
    , ListView = require('view/listview').ListView
    , TodoView = require('view/todoview').TodoView;

    exports.TodoFlowView = Backbone.View.extend({
        el: null,
        model: null,
        collection: null,
        templateObj: null,
        events:{
            //"click #maintab a": "onTab",
        },
        initialize: function(){
            var graph = this.$(".graph");
            this.paper = Raphael(graph.get(0), graph.width(), graph.height());
            this.paper.rect(290, 80, 60, 40, 10);
        },
        
        render: function(){
            
        },

        remove: function(){
            
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });
});