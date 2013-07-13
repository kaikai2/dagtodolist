define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , matcher = require('matcher.pinyin')
    , ListView = require('view/listview').ListView
    , TodoView = require('view/todoview').TodoView
    , FilterView = require('view/filter').FilterView
    ;

    exports.MyTodoListView = Backbone.View.extend({
        el: null,
        model: null,
        collection: null,
        templateObj: null,
        events:{
            "click .newTask": "onNewTask",
            "keypress #newTask": "newOnEnter",
            //"click #maintab a": "onTab",
        },
        initialize: function(){
            //this.templateObj = new jSmart(this.options.template);
            //this.$el.find("#maintab :first").tab("show");
            this.filterView = new FilterView({
                el: this.$('.filter')
            });

            this.$input = this.$("#newTask");
            this.list = new ListView({
                el: this.$("#todolist"),
                ItemView: TodoView,
                collection: this.collection,
                options:{
                    filter: this.filterView.collection,
                    template: this.$("#todolist-tpl").text(),
                }
            });
        },
        
        render: function(){
        },
        // events
        onNewTask: function(){
            var name = this.$input.val().trim();
            if (!name){
                return;
            }
            
            this.collection.create({
                name: this.$input.val().trim()
            });
            this.$input.val('');
        },
        newOnEnter: function(e){
            if (e.which !== ENTER_KEY){
                return;
            }
            
            this.onNewTask();
        },
        onTab: function(e){
            e.preventDefault();
            $(e.target).tab('show');
        },
        remove: function(){
            this.model = undefined;
            this.filterView.remove();
            this.filterView = undefined;
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });
});