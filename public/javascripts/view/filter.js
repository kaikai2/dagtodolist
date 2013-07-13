define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , matcher = require('matcher.pinyin')

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
    var FilterButton = Backbone.View.extend({
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

    exports.FilterView = Backbone.View.extend({
        el: null,
        collection: null,
        events: {
            "click .btn.all": "onFilterAll",
            "keyup input": "onFilterByWord",
            "click .clear": "onClearFilterWord",
        },
        initialize: function(){
            this.collection = new Filters();
            this.collection.add([
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
            this.$buttons = [];
            var self = this;
            var buttons = this.$(".btn.item");
            _.each(this.collection.where({type: 'button'}), function(btn, index){
                if (index < buttons.length){
                    self.$buttons.push(new FilterButton({
                        el: buttons[index],
                        model: btn,
                    }));
                }
            });
            this.$filterByName = this.$(".filter input");
            this.listenTo(this.collection, "change", this.updateFilter);
            this.updateFilter();
        },


        // events
        onFilterAll: function(){
            var value = !this.$(".all").hasClass("active");
            _.each(this.collection.where({type: 'button'}), function(btn,index){
                btn.set('selected', value);
            });
        },
        onFilterByWord: function(e){
            this.collection.findWhere({type: 'text'}).set('query', this.$filterByName.val());
        },
        onClearFilterWord: function(){
            this.$filterByName.val('');
            this.collection.findWhere({type: 'text'}).set('query', '');
        },

        // methods
        updateFilter: function(){
            var buttonFilters = this.collection.where({type: 'button'});
            var active = _.all(buttonFilters, function(filter){
                return filter.get('selected');
            })
            this.$(".all").toggleClass("active", active);
        },
        remove: function(){
            _.each(this.$buttons, function(btn, index){
                btn.remove();
            });
            this.$buttons = undefined;
            this.collection.reset();
            this.collection = undefined;
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });


});