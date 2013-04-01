
var _ = require('underscore')
, mongoose = require('mongoose')
, Todo = require('../models/todo').Todo;

_.extend(exports, {
    getById: function(id, req, res){
        Todo.findById(id, function(err, todos){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json(todos);
            }
        });
    },
    updateById: function(id, req, res){
        //res.send(404);
        console.assert(req.session && req.session.userid, "session.userid needed");
        var newData = {
            name: req.param('name'),
            content: req.param('content') || '',
            //from: new mongoose.Types.ObjectId(req.session.userid), no way to overide 'from'
            assignedTo: req.param('assignedTo'),
            depends: req.param('depends'),
            estimatedTimeInHours: req.param('estimatedTimeInHours'),
            deadlineTime: new Date(req.param('deadlineTime')),
            //createTime: new Date(),
            done: req.param('done')
        };
        if (newData.done){
            newData.closeTime = new Date();
        }
        Todo.update({
            _id: new mongoose.Types.ObjectId(id)
        }, newData, function(err, numberAffected, raw){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json({
                    numberAffected:numberAffected,
                    raw: raw
                });
            }
        });
    },
    create: function(req, res){
        //res.send(404);
        console.assert(req.session && req.session.userid, "session.userid needed");
        Todo.create({
            name: req.param('name'),
            content: req.param('content') || '',
            from: new mongoose.Types.ObjectId(req.session.userid),
            assignedTo: req.param('assignedTo'),
            depends: [],
            estimatedTimeInHours: 0,
            deadlineTime: new Date(new Date().getTime() + 86400),
            createTime: new Date(),
            //closeTime: new Date(),
            done: false
        }, function(err, todo){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                console.log(todo);
                res.json(todo);
            }
        });
    },
    deleteById: function(id, req, res){
        //res.send(404);
        Todo.remove({_id: new mongoose.Types.ObjectId(id)}, function(err){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json({result: true});
            }
        })
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