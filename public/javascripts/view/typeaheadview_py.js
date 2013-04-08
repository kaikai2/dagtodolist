define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , pinyin = require('pinyin');

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
                    var allReduced = _.reduce(all, function(all, candidates){
                        if (candidates.length == 1){
                            all.last = all.last + candidates[0];
                        }else{
                            if (all.last.length){
                                all.result.push([all.last]);
                                all.last = '';
                            }
                            all.result.push(candidates);
                        }
                        return all;
                    }, {result:[], last:''});
                    if (allReduced.last.length){
                        allReduced.result.push([allReduced.last]);
                    }
                    var allCandidates = _.reduce(allReduced.result, function(all, candidates){
                        var r = [];
                        _.each(candidates, function(c){
                            r = _.union(r, _.map(all, function(s){
                                return s+c;
                            }));
                        });
                        return r;
                    }, ['']);
                    return _.any(allCandidates, function(c){
                        return c.search(query) != -1;
                    });
                    return false;
                },
            });
        },

        getSelectIndex: function(){
            return _.indexOf(this.options.names, this.$el.val());
        },
        render: function(){
        },

    });
});
