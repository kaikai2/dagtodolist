
var _ = require('underscore')
, Todo = require('../models/todo').Todo;

_.extend(exports, {
    get_one: function(id, req, res){
        Todo.findById(id, function(err, todos){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json(todos);
            }
        });
    },
    put_one: function(id, req, res){
        res.send(404);
    },
    post_one: function(zreq, res){
        res.send(404);
    },
    delete_one: function(id, req, res){
        res.send(404);
    },
    get_all: function(req, res){
        Todo.find(function(err, todos){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json(todos);
            }
        });
    },

});