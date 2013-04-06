define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , ListView = require('view/listview').ListView
    , TodoView = require('view/todoview').TodoView;

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
            this.$input = this.$("#newTask");
            //this.listenTo(this.collection, "complete", this.onComplete);
            this.list = new ListView({
                el: this.$("#todolist"),
                ItemView: TodoView,
                itemTemplate: this.$("#todolist-tpl").text(),
                collection: this.collection,
            });
            this.collection.fetch({
//                reset:true,
                add:true,
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
        onComplete: function(){
            //this.list.fire("complete:depends");
        },
        onTab: function(e){
            e.preventDefault();
            $(e.target).tab('show');
        },
    });
});