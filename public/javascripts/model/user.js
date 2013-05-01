define(function(require, exports, module){
    var Backbone = require('backbone')
    , $ = require('jquery')
    , _ = require('underscore');
   
    var User = Backbone.Model.extend({
        urlRoot: '/user',
        idAttribute: "_id",
        defaults:{
            name: null,
            nickname: null,
        },

        checkLogin: function(next){
            $.getJSON('/user/check', function(err, json){
                if (err){
                    next(err);
                }else{
                    next(null, json.login);
                }
            });
        },
	
        //��½    
        login: function(data, next){
            $.getJSON('/user/login', {
                username: data.name,
                password: data.password
            }, function(err, json){
                if (err){
                    next(err);
                    return;
                }
                if (json.result != 'ok'){
                    next('login failed' + json.result);
                    return;
                }
                next(null);
            });
        },
        
        //�ǳ�
        logout: function(next){
            $.getJSON('/user/logout', next);
        },

        register: function(username, password, next){
            var user = new User;
            user.save({
                name: username,
                password: password
            });
            user = undefined;
        },
    });

    _.extend(exports, {
        User: User
    });
});
