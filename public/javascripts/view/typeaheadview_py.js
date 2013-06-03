define(function(require, exports, module) {
    var Backbone = require('backbone')
    , _ = require('underscore')
    , pinyinMatcher = require('matcher.pinyin');

    exports.TypeAheadView_Pinyin = Backbone.View.extend({
        el: null,
        events:{
        },
        initialize: function(){
            var self = this;
            var key_name = this.options.name;
            this.$el.typeahead({
                source: this.collection.where(this.options.filter),
                items: 8,
                matcher: function(item){
                    var name = item.get(key_name);
                    var query = this.query.toLowerCase();
                    return pinyinMatcher.match(name.toLowerCase(), query);
                },
                updater: function(item){
                    self.selected = item;
                    var model = self.collection.get(item);
                    return model ? model.get(key_name) : '';
                },
                sorter: function(items){
                    var t = [], n = [], r = [], i;
                    while (i = items.shift()){
                        var name = i.get(key_name);
                        var cid = i.cid;
                        name.toLowerCase().indexOf(this.query.toLowerCase()) ? ~name.indexOf(this.query) ? n.push(cid) : r.push(cid) : t.push(cid);
                    }
                    return t.concat(n, r);
                },
                highlighter: function(item_key){
                    var t = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
                    var model = self.collection.get(item_key);
                    if (model == undefined){
                        return 'DEBUG: cid:' + item_key + ' not found!';
                    }
                    var name = model.get(key_name);
                    return name.replace(new RegExp("(" + t + ")", "ig"), function(e, t) {
                        return "<strong>" + t + "</strong>"
                    })
                }
            });
        },

        getSelect: function(){
            return this.selected;
        },
        render: function(){
        },
        remove: function(){
            this.$el.data('typeahead').$menu.remove();
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
});
