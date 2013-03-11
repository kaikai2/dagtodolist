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
    dependOn: [mongoose.Schema.Types.ObjectId],
    estimatedTimeInHours: Number,
    deadlineTime: Date,
    createTime: Date,
    closeTime: Date,
    finished: Boolean,
});

todoSchema.method.isReady = function(cb){
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
};

var User = mongoose.model('User', userSchema);
var Todo = mongoose.model('Todo', todoSchema);
