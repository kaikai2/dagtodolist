define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , pinyin = require('pinyin');

    function match(candidateList, queryString){
        /* '大哥去tmd干活'
        var candidateList = [
            ['大','da','d'],
            ['哥','ge','g'],
            ['去','qu','q'],
            ['tmd'],
            ['干','gan','g'],
            ['活','huo','h'],
         ];
        queryString = 'qug活';
        */
        var res = [];
        for (var i = 0; i < candidateList.length; i++){
            var s = candidateList[i].join('|');
            res.push(s);
        }
        var s = '^(' + res.join(')?(') + ')$';
        var re = new RegExp(s, 'i');
        return re.test(queryString);//.match(re);
    }
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
                    //var queryRe = new RegExp(query, "i");
                    var all = _.map(item, function(c){
                        var full = pinyin(c, {
                            heteronym: true, // 开启多音字模式
                            style: pinyin.STYLE_NORMAL,
                        });
                        var initial = pinyin(c, {
                            heteronym: true, // 开启多音字模式
                            style: pinyin.STYLE_INITIALS,
                        });
                        var first = pinyin(c, {
                            heteronym: true, // 开启多音字模式
                            style: pinyin.STYLE_FIRST_LETTER,
                        });
                        var candidates = _.union(full[0], initial[0], first[0], [c]);
                        return candidates;
                    });

                    return match(all, query);
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
