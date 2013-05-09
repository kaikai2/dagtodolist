define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , ENTER_KEY = 13
    , _ = require('underscore')
    , Raphael = require('raphael.amd')
    , ListViewBase = require('view/listview').ListViewBase
    , TodoViewBase = require('view/todoview').TodoViewBase;

    var TodoDependsGraphView = Backbone.View.extend({
        el: null,
        initialize: function(){
            this.paper = this.options.paper;
            this.from = this.options.listoptions.from; // from model
            this.rect = this.options.listoptions.rect; // from obj
            this.model; // to model
            this.listenTo(this.model, "graphmove", this.updateDest);
            this.listenTo(this.from, "graphmove", this.updateSource);
            
            this.update(undefined);
            
            this.model.trigger('graphbind');
        },
        clear: function(){
            if (this.line){
                if (this.line.bg){
                    this.line.bg.remove();
                }
                if (this.line.line){
                    this.line.line.remove();
                }
                this.line = undefined;
            }
        },
        updateDest: function(dstObj){
            this.dstObj = dstObj;
            this.update(dstObj);
        },
        updateSource: function(sourceObj){
            this.update(this.dstObj);
        },
        update: function(obj2, dx, dy){
            this.clear();
            var obj1 = this.rect;
            if (!obj2){
                obj2 = obj1;
            }
            var line = undefined;
            var bg = '#abe|3'
            if (obj1.line && obj1.from && obj1.to) {
                line = obj1;
                obj1 = line.from;
                obj2 = line.to;
            }
            var bb1 = obj1.getBBox(),
            bb2 = obj2.getBBox(),
            p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
                 {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
                 {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
                 {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},

                 {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
                 {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
                 {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
                 {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
            d = {}, dis = [];
            for (var i = 0; i < 4; i++) {
                for (var j = 4; j < 8; j++) {
                    var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
                    if ((i == j - 4) || (
                        ((i != 3 && j != 6) || p[i].x < p[j].x) &&
                        ((i != 2 && j != 7) || p[i].x > p[j].x) &&
                        ((i != 0 && j != 5) || p[i].y > p[j].y) &&
                        ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                        dis.push(dx + dy);
                        d[dis[dis.length - 1]] = [i, j];
                    }
                }
            }
            var res = [0, 4];
            if (dis.length != 0) {
                res = d[Math.min.apply(Math, dis)];
            }
            var x1 = p[res[0]].x,
            y1 = p[res[0]].y,
            x4 = p[res[1]].x,
            y4 = p[res[1]].y;
            dx = Math.max(Math.abs(x1 - x4) / 2, 10);
            dy = Math.max(Math.abs(y1 - y4) / 2, 10);
            var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
            y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
            var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3),
       /*                 "m", 0, 10,
                        "c", 15, 0, 15, -20, 0, -20,
                        "s", -15, 20, 0, 20,*/
                       ].join(",");
            var attr = {
                path: path
            };
            if (line && line.line) {
                line.bg && line.bg.attr(attr);
                line.line.attr(attr);
            } else {
                var color = typeof line == "string" ? line : "#000";
                this.line = {
                    bg: bg && bg.split && this.paper.path(path).attr({
                        stroke: bg.split("|")[0],
                        fill: "none",
                        "stroke-width": bg.split("|")[1] || 3,
                        "arrow-end": "classic-narrow-short",
                    }),
                    line: this.paper.path(path).attr({
                        stroke: color,
                        fill: "none",
                        "arrow-end": "classic-narrow-short",
                    }),
                    from: obj1,
                    to: obj2
                };
            }
        },
        remove: function(){
            this.clear();
            this.paper = undefined;
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    var TodoGraphView = TodoViewBase.extend({
        el: null,
        
        initialize: function(){
            TodoViewBase.prototype.initialize.apply(this, arguments);

            this.paper = this.options.paper;

            this.obj = this.paper.set();
            this.rect = this.paper.rect(0, 0, 100, 38, 10);
            this.obj.push(this.rect);
            this.text = this.paper.text(5, 8, this.model.get('name'));
            this.obj.push(this.text);
            this.setElement(this.obj.node);
            //var color = Raphael.getColor();

            this.obj.drag(this.move, this.dragger, this.up, this, this, this);
            this.listenTo(this.model, 'change', this.updateStatus);

            this.move(Math.random() * 500, Math.random() * 300);

            this.listenTo(this.model, "graphbind", this.move);
            this.render();
        },
        render: function(){
            if (this.depends){
                this.depends.remove();
                this.depends = undefined;
            }
            this.updateStatus();
            
            this.depends = new GraphContainerView({
                paper: this.paper,
                ItemView: TodoDependsGraphView,
                collection: this.dependsCollection,
                options: {
                    from: this.model,
                    rect: this.rect,
                    
                },
            });

            return this;
        },
        updateStatus: function(){
            var color = '#468847';
            if (this.model.get('done')){
                color = '#999999';
            }else if (this.model.get('ready')){
                color = '#468847';
            }else{
                color = '#f89406';
            }
            var rectAttr = {
                fill: color,
                stroke: color,
                "fill-opacity": 0,
                "stroke-width": 2,
                cursor: "move",
            }
            var text = this.model.get('name');
            if (text.length > 8) {
                rectAttr.title = text;
                text = text.slice(0, 6) + '...';
            }

            this.text.attr({
                text: text,
                "font-size": 12,
                "text-anchor": "start",
                "width": 100,//this.rect.attr("width")
            });
            this.rect.attr(rectAttr);
        },
        dragger: function () {
            this.ox = 0;
            this.oy = 0;
            //this.obj.animate({"fill-opacity": .2}, 500);
        },
        move: function(dx, dy){
            if (dx !== undefined && dy !== undefined){
                this.obj.translate(-this.ox, -this.oy);
                this.obj.translate(dx, dy);
                this.ox = dx;
                this.oy = dy;
            }
            //for (var i = connections.length; i--;) {
            //this.paper.connection(connections[i]);
            //}
            this.model.trigger("graphmove", this.rect, dx, dy);
            //this.depends.fire("graphmove", this.rect, dx, dy);
            this.paper.safari();
        },
        up: function () {
            //this.obj.animate({"fill-opacity": 0}, 500);
        },
        remove: function(){
            if (this.depends){
                this.depends.remove();
                this.depends = undefined;
            }
            this.rect = undefined;
            this.text = undefined;
            if (this.obj){
                this.obj.remove();
                this.obj = undefined;
            }
            TodoViewBase.prototype.remove.apply(this, arguments);
        }
    });

    var GraphContainerView = ListViewBase.extend({
        event: {
        },
        initialize: function(){
            if (this.options.paper){
                this.paper = this.options.paper;
            }else{
                var obj = this.$el.get(0);
                this.paper = Raphael(obj, this.$el.width(), this.$el.height());
                var self = this;
                $(window).resize($.proxy(this.onResize, this));
                $($.proxy(this.onResize, this));
            }
            // this.paper must initialize before addOne might be called
            ListViewBase.prototype.initialize.apply(this, arguments);
        },
        resize: function(){
            this.paper.setSize(this.$el.width(), this.$el.height());
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
            return view;
        },

        remove: function(){
            if (this.options.paper !== this.paper){
                this.paper.remove();
            }
            this.paper = undefined;
            ListViewBase.prototype.remove.apply(this, arguments);
        }
    });

    var TodoFlowView = Backbone.View.extend({
        el: null,
        model: null,
        collection: null,
        templateObj: null,
        events:{
            //"click #maintab a": "onTab",
            "shown": "onTabShown",
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
        onTabShown: function(){
            this.graph.resize();
        },
        remove: function(){
            
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });
    exports.TodoFlowView = TodoFlowView;
});