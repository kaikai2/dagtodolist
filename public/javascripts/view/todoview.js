define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , NewTodoDialog = require('view/newtododialog').NewTodoDialog
    , ListView = require('view/listview').ListView
    , DependsView = require('view/dependsview').DependsView
    , ENTER_KEY = 13
    , _ = require('underscore');


    exports.TodoView = Backbone.View.extend({
        tagName: 'li',
        model: null,
        
        events:{
            'click .toggle': 'toggleCompleted',
            'click .view': 'showDetail',
            'dblclick label.name': 'edit',
            'click .destroy': 'clear',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close',
            'click .save': 'save',
            'click .depend': 'newDepend',
            //"click #newTask": "onNewTask",
            //"keypress #newTask": "newOnEnter",
            //"click #maintab a": "onTab",
        },
        initialize: function(){
            this.listoptions = this.options.listoptions;
            this.filter = this.listoptions.filter;
            this.templateObj = new jSmart(this.listoptions.template);
            //this.$el.find("#maintab :first").tab("show");
            //this.$input = this.$("#newTask");
            //this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'visible', this.toggleVisible);
            this.listenTo(this.model, 'complete:depends change:depends', this.checkDepends);
            //this.listenTo(this.model, 'change:depends', this.checkReady);
            this.listenTo(this.model, 'change:done', this.checkDone);
            this.listenTo(this.model, 'change:ready', this.updateReady);

            this.dependsCollection = this.collection.depends(this.model);
            this.listenTo(this.dependsCollection, 'complete:depends remove add', this.checkReady);
            this.listenTo(this.filter, "change", this.toggleVisible);
            this.checkReady();
            this.render();
        },
        
        render: function(){
            var self = this;
            if (this.depends){
                this.depends.remove();
                this.depends = undefined;
            }
            this.$el.html(
                this.templateObj.fetch({
                    model: this.model.toJSON(),
                })
            );
            this.$el.toggleClass('completed', this.model.get('done'));
            this.toggleVisible();
            this.$input = this.$('.edit');
            this.depends = new ListView({
                el: this.$(".depends"),
                ItemView: DependsView,
                collection: this.dependsCollection,
                options: {
                    template: $("#dependslist-tpl").text(),
                },
            });
            return this;
        },

        showDetail: function(){
            this.$el.toggleClass('detail');
        },
        checkReady: function(){
            var ready = undefined == this.dependsCollection.findWhere({done: false}) ? true : false;
            console.log('set', this.model.get('name'), this.model.get('ready'), 'to', ready);
            this.model.set('ready', ready);
            this.$(".view .state").toggleClass("ready", ready);
        },
        updateReady: function(){
            this.$el
        },
        checkDepends: function(){
            //this.render();
            var models = this.collection.depends(this.model).models;
            this.dependsCollection.set(models);
        },
        toggleVisible: function () {
            this.$el.toggleClass('hidden', this.isHidden());
        },

        isHidden: function () {
            var model = this.model;
            var textFilter = this.filter.findWhere({type: 'text'});
            if (!textFilter.get('filte').call(textFilter, model))
                return true;
            return !_.any(this.filter.where({selected: true}), function(filter){
                var filte = filter.get('filte');
                return filte.call(filter, model);
            });
        },

        // Toggle the `"completed"` state of the model.
        toggleCompleted: function (e) {
            this.model.toggle();
            //this.collection.trigger('complete');
	    e.stopPropagation();
        },
	checkDone: function() {
	    //this.$(".toggle").prop("checked", this.model.get('done'));
            if (this.model.get('done')){
                this.$(".view .state").addClass("done");
            }else{
                this.$(".view .state").removeClass("done");
            }
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
                content: this.$(".content").val(),
                depends: _.map(this.$(".depends > li > div"), function(a){
			return $(a).attr('cid');
		    }),
                estimatedTimeInHours: this.$(".estimatedTimeInHours").val(),
            };
            
            this.model.save(value);
        },
        newDepend: function(){
            var dlg = new NewTodoDialog({
                template: $("#newtodo-dialog-tpl").text(),
                model: this.model,
                collection: this.collection,
            });
            dlg.render();
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
