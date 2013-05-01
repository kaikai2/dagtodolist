var _ = require('underscore')
, mongoose = require('mongoose')
, async = require('async')
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
        var depends = req.param('depends') || [];

        async.waterfall([
            function(cb){
                console.log('findPerior');
                if (depends.length == 0){
                    cb(null, 0);
                    return;
                }
                var dependsObjId = _.map(depends, function(id){
                    return new mongoose.Types.ObjectId(id);
                });
                
                Todo.find({id: {$in: dependsObjId}, done: false}).count(cb);                
            },
            function(periorCount, cb){
                console.log('doUpdate', periorCount, cb);
                var newData = {
                    name: req.param('name'),
                    content: req.param('content') || '',
                    //from: new mongoose.Types.ObjectId(req.session.userid), no way to overide 'from'
                    assignedTo: req.param('assignedTo'),
                    depends: depends,
                    estimatedTimeInHours: req.param('estimatedTimeInHours'),
                    deadlineTime: new Date(req.param('deadlineTime')),
                    //createTime: new Date(),
                    done: req.param('done'),
                    ready: periorCount == 0,
                };
                if (newData.done){
                    newData.closeTime = new Date();
                }
                console.log('update,newData', newData);
                Todo.update({
                    _id: new mongoose.Types.ObjectId(id)
                }, newData, function(err, numberAffected, raw){
                    console.log(err, numberAffected, raw);
                    cb(err, numberAffected, raw);
                });
            },
        ], function(err, numberAffected, raw){
            console.log('end: ');
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                /*res.json({
                    numberAffected:numberAffected,
                    raw: raw
                });*/
                res.json({});
            }
        });
    },
    create: function(req, res){
        if (!req.session.userid){
		req.session.userid = 1;
	}
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
            done: false,
            ready: true,
        }, function(err, todo){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                console.log(todo, todo.ready);
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
        var userid = req.session.userid || 1;
        console.log('fetch all with' + userid);
        Todo.find({$or: [
            {assignedTo: userid},
            {from: userid},
        ]}, function(err, todos){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json(todos);
            }
        });
    },

});