define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , Task = require('model/task').Task
    , ListView = require('view/listview').ListView
    , TodoView = require('view/todoview').TodoView
    , TypeAheadView_Pinyin = require('view/typeaheadview_py').TypeAheadView_Pinyin;

    exports.NewTodoDialog = Backbone.View.extend({
        el: null,
        model: null,
        collection: null,
        templateObj: null,
        events:{
            "click .cancel": "cancel",
            "click .add": "add",
        },
        initialize: function(){
            this.$el.html(this.options.template);
            this.$el.addClass("modal hide fade");
            this.model = new Task;
            this.dependents = this.options.dependents;
            this.$el.modal();
            var unDoneTasks = this.collection.where({done: false});
            var names = _.map(unDoneTasks, function(model){
                return model.get('name');
            });

            this.findDependsView = new TypeAheadView_Pinyin({
                el: this.$("#selecttask input[name=id]"),
                names: names,
            });
        },
        
        render: function(){
        },

	// events
        add: function(){
            var self = this;
            var curId = this.$(".tab-pane.active").attr('id');
            if (curId == "newtask"){
                this.model.save({
                    name: this.$("[name=name]").val(),
                    content: this.$("[name=content]").val(),
                }, {
                    success: function(model, response, options){
                        self._addDepends(self.model.id);
                        self.collection.add(self.model);

                        self.remove();
                    },
                    error: function(model, xhr, options){
                    }
                });
            }else if (curId == "selecttask"){
                var selIndex = this.findDependsView.getSelectIndex();
                if (selIndex != -1){
                    var model = this.collection.at(selIndex);
                    if (model){
                        this._addDepends(model.id);
                        this.remove();
                    }
                }
            }
        },
        _addDepends: function(id){
            var depends = (this.dependents.get("depends") || []).slice();
            depends.push(id);
            this.dependents.set("depends", depends);
            this.dependents.save();
        },
        cancel: function(){
            this.$el.modal('hide');
            this.model.destroy();
            this.dependents = null;
            this.remove();
        },
        remove: function(){
	    this.$el.modal('hide');
            this.model = undefined;
            this.dependents = undefined;
            if (this.findDependsView){
                this.findDependsView.remove();
                this.findDependsView = undefined;
            }
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });
});
