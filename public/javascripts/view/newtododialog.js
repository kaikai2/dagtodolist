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
        events:{
            "click .cancel": "cancel",
            "click .add": "add",
	    "hidden": "remove",
            "submit form": "preventDefault",
        },
        initialize: function(){
            this.$el.html(this.options.template);
            this.$el.addClass("modal hide fade");
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
        preventDefault: function(e){
            return false;
        },
        add: function(){
            var curId = this.$(".tab-pane.active").attr('id');
            if (curId == "newtask"){
                var model = new Task;
                var self = this;
                model.save({
                    name: this.$("[name=name]").val(),
                    content: this.$("[name=content]").val(),
                }, {
                    success: function(){
                        self.collection.add(model);
                        self._addDepends(model.id);
                        self.$el.modal('hide');
                    }
                });
            }else if (curId == "selecttask"){
                var selIndex = this.findDependsView.getSelectIndex();
                if (selIndex != -1){
                    var model = this.collection.at(selIndex);
                    if (model){
                        this._addDepends(model.id);
                        this.$el.modal('hide');
                    }
                }
            }
        },
        _addDepends: function(id){
            var depends = (this.model.get("depends") || []).slice();
            depends.push(id);
            this.model.set("depends", depends);
            this.model.save();
        },
        cancel: function(){
            this.$el.modal('hide');
        },
        remove: function(){
            this.model = undefined;
            if (this.findDependsView){
                this.findDependsView.remove();
                this.findDependsView = undefined;
            }
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });
});
