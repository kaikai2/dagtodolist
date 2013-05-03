var _ = require('underscore')
, mongoose = require('mongoose')
, async = require('async')
, User = require('../models/user').User;

_.extend(exports, {
    checkSession: function(req, res){
        if (!req.session || !req.session.userid){
            res.json({login: false});
            return;
        }

        User.findById(req.session.userid, function(err, user){
            if (err){
                res.send(500, err);
                return;
            }
            if (user && user.id == req.session.userid){
                res.json({login: true, name: user.name, nickname: user.nickname});
            }else{
                req.session.userid = undefined;
                res.json({login: false});
            }
        });
    },
    login: function(req, res){
        var name = req.param('username');
        var password = req.param('password');
        
        User.findOne({name: name}, function(err, user){
            if (err){
                res.send(500, err);
                return;
            }
            if (!user){
                User.create({name: name, password: password}, function(err, user){
                    if (err){
                        res.send(500, err);
                        return;
                    }
                    req.session.userid = user.id;
                    res.json({});
                });
                return;
            }
            console.log(user);
            /// <FIXME> check password here 
            req.session.userid = user.id;
            res.json({});
        });
    },
    logout: function(req, res){
        req.session.userid = undefined;
        res.json({});
    },
    getById: function(id, req, res){
        var idObj = new mongoose.Types.ObjectId(id);
        User.findById(idObj, function(err, users){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json(users);
            }
        });
    },
    updateById: function(id, req, res){
        console.assert(req.session && req.session.userid, "session.userid needed");
        var name = req.param('name');
        if (req.session.userid != id){
            res.send(403);
            return;
        }
        var newData = {};
        if (name){
            newData.name = name;
        }
        User.update({
            _id: new mongoose.Types.ObjectId(id)
        }, newData, function(err, numberAffected, raw){
            console.log(err, numberAffected, raw);
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
        User.create({
            name: req.param('name'),
        }, function(err, user){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json(user);
            }
        });
    },
    deleteById: function(id, req, res){
        //res.send(404);
        if (id != req.session.userid){
            res.send(403);
            return;
        }
        User.remove({_id: new mongoose.Types.ObjectId(id)}, function(err){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json({result: true});
            }
        })
    },
    get_all: function(req, res){
        User.find(function(err, users){
            if (err){
                console.log(err);
                res.send(500, err);
            }else{
                res.json(users);
            }
        });
    },

});