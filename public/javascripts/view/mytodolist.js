define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , matcher = require('matcher.pinyin')
    , ListView = require('view/listview').ListView
    , TodoView = require('view/todoview').TodoView;

    var Filter = Backbone.Model.extend({
        defaults:{
            type: 'button',
            name: null,
            selected: false,
            filte: function(task){
                return true;
            }
        },
    });
    var Filters = Backbone.Collection.extend({
        model: Filter,
    });
    var FilterView = Backbone.View.extend({
        events:{
            "click": "toggle",
        },
        initialize: function(){
            this.listenTo(this.model, "change:selected", this.changeSelected);
            this.changeSelected();
        },
        toggle: function(){
            this.model.set('selected', !this.model.get('selected'));
        },
        changeSelected: function(){
            if (this.model.get('selected')){
                this.$el.addClass("active");
            }else{
                this.$el.removeClass("active");
            }
        }
    });
    exports.MyTodoListView = Backbone.View.extend({
        el: null,
        model: null,
        collection: null,
        templateObj: null,
        events:{
            "click .newTask": "onNewTask",
            "keypress #newTask": "newOnEnter",
            "click .filter .btn.all": "onFilterAll",
            "keyup .filter input": "onFilterByWord",
            "click .filter .clear": "onClearFilterWord",
            //"click #maintab a": "onTab",
        },
        initialize: function(){
            //this.templateObj = new jSmart(this.options.template);
            //this.$el.find("#maintab :first").tab("show");
            this.$buttons = [];
            this.filters = new Filters();
            this.filters.add([
                {
                    name: '就绪',
                    filte: function(task){
                        return !task.get('done') && task.get('ready');
                    },
                    selected: true,
                },
                {
                    name: '阻塞',
                    filte: function(task){
                        return !task.get('done') && !task.get('ready');
                    },
                    selected: true,
                },
                {
                    name: '完成',
                    filte: function(task){
                        return task.get('done');
                    },
                    selected: true,
                },
                {
                    type: 'text',
                    name: '名字',
                    filte: function(task){
                        var query = this.get('query');
                        if (!query || query.length == 0){
                            return true;
                        }
                        var name = task.get('name').toLowerCase();
                        return matcher.match(name, query);
                    },
                    query: '',
                },
            ]);
            this.$input = this.$("#newTask");
            this.list = new ListView({
                el: this.$("#todolist"),
                ItemView: TodoView,
                collection: this.collection,
                options:{
                    filter: this.filters,
                    template: this.$("#todolist-tpl").text(),
                }
            });
            this.collection.fetch({
//                reset:true,
                add:true,
            });
            var self = this;
            var buttons = this.$(".filter .btn.item");
            _.each(this.filters.where({type: 'button'}), function(btn, index){
                if (index < buttons.length){
                    self.$buttons.push(new FilterView({
                        el: buttons[index],
                        model: btn,
                    }));
                }
            });
            this.$filterByName = this.$(".filter input");
            this.listenTo(this.filters, "change", this.updateFilter);
            this.updateFilter();
        },
        
        render: function(){
        },
        updateFilter: function(){
            var buttonFilters = this.filters.where({type: 'button'});
            var active = _.all(buttonFilters, function(filter){
                return filter.get('selected');
            })
            this.$(".filter .all").toggleClass("active", active);
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
        onFilterAll: function(){
            var value = !this.$(".filter .all").hasClass("active");
            this.filters.each(function(btn,index){
                btn.set('selected', value);
            });
        },
        onTab: function(e){
            e.preventDefault();
            $(e.target).tab('show');
        },
        onFilterByWord: function(e){
            this.filters.findWhere({type: 'text'}).set('query', this.$filterByName.val());
        },
        onClearFilterWord: function(){
            this.$filterByName.val('');
            this.filters.findWhere({type: 'text'}).set('query', '');
        },
        remove: function(){
            this.model = undefined;
            _.each(this.$buttons, function(btn, index){
                btn.remove();
            });
            this.$buttons = undefined;
            this.filters.reset();
            this.filters = undefined;
            
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });
});