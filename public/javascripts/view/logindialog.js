define(function(require, exports, module) {
    var Backbone = require('backbone')
    , $ = require('jquery')
    , bootstrap = require('bootstrap')
    , ENTER_KEY = 13
    , User = require('model/user')
    , _ = require('underscore');

    exports.LoginDialog = Backbone.View.extend({
        el: null,
        model: null,
        collection: null,
        events:{
            "click .cancel": "cancel",
            "click .login": "login",
            "keypress input[name=name]": "submit",
	    //"hidden": "remove",
        },
        initialize: function(){
            //this.$el.addClass("modal hide fade");
            this.$el.modal({
                show: false,
                backdrop: 'static',
                keyboard: false,
            });
            this.showed = false;
        },

        show: function(){
          if (this.showed){
            this.cancel();
          }
            this.$("input").val('');
            this.$el.modal('show');
            this.showed = true;
        },
        render: function(){
        },

	// events
        submit: function(e){
            if (e.which === ENTER_KEY){
                this.login();
            }
        },
        login: function(){
            this.cancel();
            var self = this;
            this.model.login({
                name: this.$("[name=name]").val(),
                password: this.$("[name=password]").val(),
            }, function(err){
                if (!err){
                    Backbone.history.navigate("check", {trigger: true});
                }else{
                  self.show();
                }
            });
        },
        cancel: function(){
            this.$el.modal('hide');
            this.showed = false;
        },
        remove: function(){
            this.model = undefined;
            Backbone.View.prototype.remove.apply(this, arguments);
        },
    });
});
