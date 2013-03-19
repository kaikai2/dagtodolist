"use strict";

var util = require('util');
var fs = require('fs');
var _ = require('underscore');
var options = {
	file: 'accesslog.txt',
	error: 'errorlog.txt'
};
exports.init = function(_options){
	options = _.extend(options, _options);
};
function fix2num(n){
	return [0, n].join('').slice(-2);
}
exports.file = function(){
	return options.file;
};

var level = {
	ERROR:'error',
	OK:'ok',
	BOLD:'bold',
	ASSERTION:'assertion',
};
exports.level = level;
var colorTag = {
    "error_prefix": "\u001B[31m",
    "error_suffix": "\u001B[39m",
    "ok_prefix": "\u001B[32m",
    "ok_suffix": "\u001B[39m",
    "bold_prefix": "\u001B[1m",
    "bold_suffix": "\u001B[22m",
    "assertion_prefix": "\u001B[35m",
    "assertion_suffix": "\u001B[39m"
};

function do_log(file, req, msg){
	var curdate = new Date();
	var reqInfo = 'NaN invalid@0.0.0.0 [N/A N/A]';
	if (req){
		var user = req.session.username ? req.session.username : '<unauthed>';
		reqInfo = util.format('%d %s@%s [%s %s]', +req.id, user, req.client.remoteAddress, req.method, req.url);
	}

	var line = util.format('%d-%s-%s %s:%s:%s %s %s\r\n',
		curdate.getFullYear(), fix2num(curdate.getMonth() + 1), fix2num(curdate.getDate()),
		fix2num(curdate.getHours()), fix2num(curdate.getMinutes()), fix2num(curdate.getSeconds()),
		reqInfo,
		msg);
	fs.appendFile(file, line);
}

exports.log = function(req, msg){
	do_log(options.file, req, msg);
};

exports.console = function(req, tag, level, msg){
	console.log([
		colorTag[level + "_prefix"],
		tag,
		colorTag[level + "_suffix"],
		' ',
		msg].join(''));
};

exports.error = function(req, msg){
	exports.console(req, 'ERROR!', level.ERROR, msg);
	do_log(options.error, req, msg);
};
