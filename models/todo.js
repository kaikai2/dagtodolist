var _ = require('underscore');
var mongoose = require('mongoose');
var async = require('async');

var userSchema = mongoose.Schema({
    name: String,
});

var todoSchema = mongoose.Schema({
    name: String,
    content: String,
    from: mongoose.Schema.Types.ObjectId,
    assigndTo: mongoose.Schema.Types.ObjectId,
    depends: [mongoose.Schema.Types.ObjectId],
    estimatedTimeInHours: Number,
    deadlineTime: Date,
    createTime: Date,
    closeTime: Date,
    done: Boolean,
    ready: Boolean,
});

_.extend(todoSchema.method, {
    isReady: function(cb){
        if (this.finished){
            cb(null, false);
            return;
        }
        if (this.dependOn.length > 0){
            this.model('Todo').find({_id: {$in: this.dependOn}}, function(err, depends){
                if (err){
                    cb(err);
                    return;
                }
                for (var i = 0, l = depends.length; i < l; ++i){
                    if (!depends[i].finished){
                        cb(null, false);
                        return;
                    }
                }
                cb(null, true);
            });
        }else{
            cb(null, true);
        }
    },
});

_.extend(todoSchema.statics, {
/*    findById: function(id, cb){
        this.model('Todo').find({_id: new mongoose.ObjectID(id)}, cb);
    },*/
});

_.extend(exports, {
    User: mongoose.model('User', userSchema),
    Todo: mongoose.model('Todo', todoSchema),
});
