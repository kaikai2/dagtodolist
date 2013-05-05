define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , Raphael = require('raphael.amd')
    , ListView = require('view/listview').ListView;

    var TodoGraphView = Backbone.View.extend({
        el: null,
        
        initialize: function(){
            this.paper = this.options.paper;

            this.obj = this.paper.set();
            this.rect = this.paper.rect(0, 0, 100, 38, 10);
            this.obj.push(this.rect);
            this.text = this.paper.text(5, 5, this.model.get('name'));
            this.obj.push(this.text);
            this.setElement(this.obj.node);
            //var color = Raphael.getColor();

            this.obj.drag(this.move, this.dragger, this.up, this, this, this);
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        render: function(){
            var color = '#468847';
            if (this.model.get('done')){
                color = '#999999';
            }else if (this.model.get('ready')){
                color = '#468847';
            }else{
                color = '#f89406';
            }
                
            this.text.attr({
                text: this.model.get('name'),
                "text-anchor": "start",
            });
            this.rect.attr({
                fill: color,
                stroke: color,
                "fill-opacity": 0,
                "stroke-width": 2,
                cursor: "move",
            });
        },
        dragger: function () {
            this.ox = 0;//this.obj.type == "rect" ? this.obj.attr("x") : this.obj.attr("cx");
            this.oy = 0;//this.obj.type == "rect" ? this.obj.attr("y") : this.obj.attr("cy");
            //this.obj.animate({"fill-opacity": .2}, 500);
        },
        move: function(dx, dy){
            /*var att = this.obj.type == "rect" ? {
                x: this.ox + dx,
                y: this.oy + dy
            } : {
                cx: this.ox + dx,
                cy: this.oy + dy
            };
            this.obj.attr(att);
            */
            this.obj.translate(-this.ox, -this.oy);
            this.obj.translate(dx, dy);
            this.ox = dx;
            this.oy = dy;
            //for (var i = connections.length; i--;) {
                //this.paper.connection(connections[i]);
            //}
            this.paper.safari();
        },
        up: function () {
            //this.obj.animate({"fill-opacity": 0}, 500);
        },
        remove: function(){
            this.obj.remove();
            this.rect = undefined;
            this.text = undefined;
            this.obj = undefined;

            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });
    var TodoDependsGraphView = Backbone.View.extend({
        el: null,
        initialize: function(){
            
        },
    });

    var GraphContainerView = ListView.extend({
        initialize: function(){
            ListView.prototype.initialize.apply(this, arguments);
            var obj = this.$el.get(0);
            this.paper = Raphael(obj, this.$el.width(), this.$el.height());
        },

        addOne: function(model){
            var view = new this.ItemView({
                model: model,
                //template: this.options.options.template,
                collection: this.collection,
                listoptions: this.options.options,
                paper: this.paper,
            });
            //this.$el.append(view.render().el);
            this.views.push(view);
        },

        remove: function(){
            this.paper.remove();
            this.paper = undefined;
            ListView.prototype.remove.apply(this, arguments);
        }
    });

    exports.TodoFlowView = Backbone.View.extend({
        el: null,
        model: null,
        collection: null,
        templateObj: null,
        events:{
            //"click #maintab a": "onTab",
        },
        initialize: function(){
            var graph = this.$(".graph");

            this.graph = new GraphContainerView({
                el: graph,
                collection: this.collection,
                ItemView: TodoGraphView,
                options: {

                }
            })
        },
        addOne: function(){
            
        },
        render: function(){
            
        },

        remove: function(){
            
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });
});