var _ = require('underscore');


_.extend(exports, {
    change: function(req, res){
        var change = req.session.change || {};
        res.json(change);
    },
});

/*
 * GET users listing.
 */
exports.list = function(req, res){
  res.send("respond with a resource");
};