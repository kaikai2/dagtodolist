define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore');


    exports.TodoView = Backbone.View.extend({
        tagName: 'li',
        model: null,
        
        events:{
            'click .toggle': 'toggleCompleted',
            'click label.name': 'showDetail',
            'dblclick label.name': 'edit',
            'click .destroy': 'clear',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close',
            'click .save': 'save',
            //"click #newTask": "onNewTask",
            //"keypress #newTask": "newOnEnter",
            //"click #maintab a": "onTab",
        },
        initialize: function(){
            this.templateObj = new jSmart(this.options.template);
            //this.$el.find("#maintab :first").tab("show");
            //this.$input = this.$("#newTask");
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'visible', this.toggleVisible);
        },
        
        render: function(){
            this.$el.html(
                this.templateObj.fetch({
                    model: this.model.toJSON()
                }));
            this.$el.toggleClass('completed', this.model.get('completed'));
            this.toggleVisible();
            this.$input = this.$('.edit');
            return this;
        },

        showDetail: function(){
            this.$el.toggleClass('detail');
        },

        toggleVisible: function () {
            this.$el.toggleClass('hidden', this.isHidden());
        },

        isHidden: function () {
            var isCompleted = this.model.get('completed');
            return false;/*(// hidden cases only
               (!isCompleted && app.TodoFilter === 'completed') ||
                    (isCompleted && app.TodoFilter === 'active')
            );*/
        },

        // Toggle the `"completed"` state of the model.
        toggleCompleted: function () {
            this.model.toggle();
        },

        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function () {
            this.$el.addClass('editing');
            this.$input.focus();
        },


        // Close the `"editing"` mode, saving changes to the todo.
        close: function () {
            var value = this.$input.val().trim();

            console.log('close editing mode with ', value);
            if (value) {
                this.model.save({ name: value });
            } else {
                this.clear();
            }

            this.$el.removeClass('editing');
        },

        save: function(){
            var value = {
                deadlineTime: this.$(".deadline").val(),
            };
            this.model.save(value);
        },
        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function (e) {
            if (e.which === ENTER_KEY) {
                //this.close();
                e.target.blur();
            }
        },

        // Remove the item, destroy the model from *localStorage* and delete its view.
        clear: function () {
            this.model.destroy();
        }
    });
});