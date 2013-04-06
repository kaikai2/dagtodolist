define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , pinyin = require('pinyin')
    , Task = require('model/task').Task
    , ListView = require('view/listview').ListView
    , TodoView = require('view/todoview').TodoView;

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

            this.$("#selecttask input[name=id]").typeahead({
                source: names,
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
                        var candidates = _.union(full[0], initial[0]);
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
                    /*var match = function(a){
                        var matchString = _.map(a, function(s){
                            if (s.length == 1){
                                if (s[0].length == 1)
                                    return s[0] + '?';
                                return '(?:' + s[0] + ')?';
                            }
                            return '(?:' + s.join('|') + ')?';
                        }).join('');
                        if (query.search(new RegExp(matchString)) != -1)
                            return true;
                        return false;
                    }
                    if (match(allReduced.result))
                        return true;*/
                    return false;
                },
            });//attr("data-source", JSON.stringify(names));
        },
        
        render: function(){
        },

	// events
        add: function(){
            var self = this;
            this.model.save({
                name: this.$("[name=name]").val(),
                content: this.$("[name=content]").val(),
            }, {
                success: function(model, response, options){
                    var depends = (self.dependents.get("depends") || []).slice();
                    depends.push(model.id);
                    self.dependents.set("depends", depends);
                    self.dependents.save();
                    self.collection.add(self.model);
		    self.$el.modal('hide');
		    self.model = null;
		    self.dependents = null;
                    self.remove();
                },
                error: function(model, xhr, options){
                }
            });
        },
        cancel: function(){
            this.$el.modal('hide');
            this.model.destroy();
            this.dependents = null;
            this.remove();
        },

    });
});
