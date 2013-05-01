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
            var result = null;
            $.getJSON('/user/check', function(json){
                result = json;
            }).complete(function(jqXHR, textStatus){
                if (textStatus != 'success'){
                    next(textStatus);
                }else{
                    next(null, result.login);
                }
                result = undefined;
            });
        },
	
        //µÇÂ½    
        login: function(data, next){
            var result = null;
            $.getJSON('/user/login', {
                username: data.name,
                password: data.password
            }, function(json){
                result = json;
            }).complete(function(jqXHR, textStatus){
                if (textStatus != 'success'){
                    next(textStatus);
                }else if (result.result != 'ok'){
                    next('login failed' + result.result);
                }else{
                    next(null);
                }
                result = undefined;
            });
        },
        
        //µÇ³ö
        logout: function(next){
            $.getJSON('/user/logout').complete(next);
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
