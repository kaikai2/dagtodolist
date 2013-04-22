define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , ListView = require('view/listview').ListView
    , TodoView = require('view/todoview').TodoView;

    var Button = Backbone.Model.extend({
        defaults:{
            name: null,
            selected: false,
        }
    });
    var Buttons = Backbone.Collection.extend({
        model: Button,
    });
    var ButtonView = Backbone.View.extend({
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
            //"click #maintab a": "onTab",
        },
        initialize: function(){
            //this.templateObj = new jSmart(this.options.template);
            //this.$el.find("#maintab :first").tab("show");
            this.$input = this.$("#newTask");
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
            this.$buttons = [];
            this.buttons = new Buttons();
            this.buttons.add([
                {name: '就绪'},
                {name: '阻塞'},
                {name: '完成'},
            ]);
            var self = this;
            var buttons = this.$(".filter .btn:not(.all)");
            this.buttons.each(function(btn, index){
                if (index < buttons.length){
                    self.$buttons.push(new ButtonView({
                        el: buttons[index],
                        model: btn,
                    }));
                }
            });
            this.listenTo(this.buttons, "change", this.updateFilter);
        },
        
        render: function(){
        },
        updateFilter: function(){
            if (this.buttons.any(function(btn){
                return !btn.get('selected');
            })){
                this.$(".filter .all").removeClass("active");
            }else{
                this.$(".filter .all").addClass("active");
            }
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
            this.buttons.each(function(btn,index){
                btn.set('selected', value);
            });
        },
        onTab: function(e){
            e.preventDefault();
            $(e.target).tab('show');
        },


        remove: function(){
            this.model = undefined;
            _.each(this.$buttons, function(btn, index){
                btn.remove();
            });
            this.$buttons = undefined;
            this.buttons.reset();
            this.buttons = undefined;
            
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });
});