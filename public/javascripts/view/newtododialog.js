define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , Task = require('model/task').Task
    , ListView = require('view/listview').ListView
    , TodoView = require('view/todoview').TodoView;

    exports.NewTodoDialog = Backbone.View.extend({
        el: null,
        model: null,
        collection: null,
        templateObj: null,
        events:{
            "click #newTask": "onNewTask",
            "keypress #newTask": "newOnEnter",
            "click .cancel": "cancel",
            "click .add": "add",
        },
        initialize: function(){
            this.model = new Task;
            this.dependents = this.options.dependents;
            this.$el.modal();
        },
        
        render: function(){
        },

        add: function(){
            var self = this;
            this.model.save({
                name: this.$("[name=name]").val(),
                content: this.$("[name=content]").val(),
            }, {
                success: function(model, response, options){
                    var depends = (self.dependents.get("depends") || []).slice();
                    depends.push(model.id);
                    self.dependents.set("depends", depends);
                    self.dependents.save();
                    self.collection.add(self.model);
                },
                error: function(model, xhr, options){
                }
            });
        },
        cancel: function(){
            this.$el.modal('hide');
            this.model.destroy();
            this.dependents = null;
        },

        // events
        onNewTask: function(){
            
            //this.model.
        },
        newOnEnter: function(e){
            if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
                return;
            }
            
            this.collection.create({
                name: this.$input.val().trim()
            });
            this.$input.val('');
        },

    });
});