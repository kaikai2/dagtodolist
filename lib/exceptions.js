//"use strict";

var util = require('util');
var log = require('./log');

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  log.error(null, msg);
  Error.captureStackTrace(this, arguments.callee);
}
util.inherits(NotFound, Error);


function InvalidHandler(msg){
  this.name = 'InvalidHandler';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}
util.inherits(InvalidHandler, Error);

function stack(level){
	var s = [];
	try{
		i.dont.exist += 0;
	}catch(e){
		s = e.stack.split('\n');
	}
	var line = s[level];
	if (typeof line == "string"){
		var info = line.trim().split(' ');
		if (info[2]){
			var posInfo = info[2].slice(1,-1).split(':');
			return {
				func:info[1],
				path:posInfo.slice(0, -2).join(':'),
				line:posInfo.slice(-2,-1)[0],
				pos: posInfo.slice(-1)[0]
			};
		}
		if (info[1]){
			var posInfo = info[1].split(':');
			if (posInfo.length >= 3){
				return {
					func:"<unknown>",
					path:posInfo.slice(0, -2).join(':'),
					line:posInfo.slice(-2,-1)[0],
					pos: posInfo.slice(-1)[0]
				};
			}else{
				log.error(req, 'failed to fetch stack info from this line: [' + line + ']');
				log.error(req, e.stack);
			}
		}
	}
	return {};
}

exports.NotFound = NotFound;

exports.caller = function(){
	return stack(4);
}
exports.stack = stack;
