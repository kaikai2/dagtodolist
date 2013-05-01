var _ = require('underscore');
var mongoose = require('mongoose');
var async = require('async');

var userSchema = mongoose.Schema({
    name: String,
});

_.extend(exports, {
    User: mongoose.model('User', userSchema),
});
