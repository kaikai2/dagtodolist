define(function(require, exports, module) {
    var Backbone = require('backbone')
    , _ = require('underscore')
    , pinyinMatcher = require('matcher.pinyin');

    exports.TypeAheadView_Pinyin = Backbone.View.extend({
        el: null,
        events:{
        },
        initialize: function(){
            this.$el.typeahead({
                source: this.options.names,
                items: 8,
                matcher: function(item){
                    var query = this.query.toLowerCase();
                    return pinyinMatcher.match(item.toLowerCase(), query);
                },
            });
        },

        getSelectIndex: function(){
            return _.indexOf(this.options.names, this.$el.val());
        },
        render: function(){
        },
        remove: function(){
            this.$el.data('typeahead').$menu.remove();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
});
