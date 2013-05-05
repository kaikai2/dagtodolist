define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , NewTodoDialog = require('view/newtododialog').NewTodoDialog
    , ListView = require('view/listview').ListView
    , DependsView = require('view/dependsview').DependsView
    , ENTER_KEY = 13
    , _ = require('underscore');


    
    var TodoViewBase = Backbone.View.extend({
        model: null,
        
        events:{
        },
        initialize: function(){
            this.listoptions = this.options.listoptions;
            this.filter = this.listoptions.filter;

            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'complete:depends change:depends', this.checkDepends);

            this.dependsCollection = this.collection.depends(this.model);
            this.listenTo(this.dependsCollection, 'complete:depends remove add', this.checkReady);
            this.checkReady();
        },
        checkReady: function(){
            var ready = undefined == this.dependsCollection.findWhere({done: false}) ? true : false;
            console.log('set', this.model.get('name'), this.model.get('ready'), 'to', ready);
            this.model.set('ready', ready);
        },
        checkDepends: function(){
            if (!_.isEqual(this.model.previous('depends'), this.model.get('depends'))){
                var models = this.collection.depends(this.model).models;
                this.dependsCollection.set(models);
            }
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

        // Remove the item, destroy the model from *localStorage* and delete its view.
        clear: function () {
            this.model.destroy();
        }
    });
    exports.TodoViewBase = TodoViewBase;
    exports.TodoView = TodoViewBase.extend({
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
        },
        initialize: function(){
            TodoViewBase.prototype.initialize.apply(this, arguments);

            this.listoptions = this.options.listoptions;
            this.templateObj = new jSmart(this.listoptions.template);

            this.listenTo(this.model, 'visible', this.updateVisible);
            this.listenTo(this.model, 'change:done', this.updateDone);
            this.listenTo(this.model, 'change:ready', this.updateReady);

            this.listenTo(this.filter, "change", this.updateVisible);
            this.render();
        },
        
        render: function(){
            if (this.depends){
                this.depends.remove();
                this.depends = undefined;
            }
            //TodoViewBase.prototype.render.apply(this, arguments);

            this.$el.html(
                this.templateObj.fetch({
                    model: this.model.toJSON(),
                })
            );
            this.$el.toggleClass('completed', this.model.get('done'));
            this.updateVisible();
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
        updateReady: function(){
            var ready = this.model.get('ready');
            this.$(".view .state").toggleClass("ready", ready);
        },
        updateVisible: function () {
            this.$el.toggleClass('hidden', this.isHidden());
        },

        updateDone: function() {
            //this.$(".toggle").prop("checked", this.model.get('done'));
            this.$(".view .state").toggleClass("done", this.model.get('done'));
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
