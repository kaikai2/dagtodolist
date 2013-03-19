
function checkAndCall(module, name){
    if (module && name in module && typeof module[name] == "function"){
        var args = Array.prototype.slice.call(arguments, 2);
        module[name].apply(null, args);
        return true;
    }
    return false;
}

exports.route = function(app, basePath, middleware, module){
    app.all(basePath + '/:id', middleware, function(req, res){
	switch(req.method){
	case 'GET':  // fetch id
            if (checkAndCall(module, "get_one", req.param('id'), req, res)){
                return;
            }
            break;
	case 'PUT':  // update id
            if (checkAndCall(module, "put_one", req.param('id'), req, res)){
                return;
            }
            break;
	case 'POST': // create id
	    break;
	case 'DELETE': // delete id
            if (checkAndCall(module, "delete_one", req.param('id'), req, res)){
                return;
            }
            break;
	default:
	}
	res.send(404, 'invalid method');
    });
    app.all(basePath, middleware, function(req, res){
	switch(req.method){
	case 'GET': // fetch all
            if (checkAndCall(module, "get_all", req, res)){
                return;
            }
            break;
	case 'PUT':
	    break;
	case 'POST':
            if (checkAndCall(module, "post_one", req, res)){
                return;
            }
            break;
	case 'DELETE':
	default:
	    break;
	}
	res.send(404, 'invalid method');
    });
};
