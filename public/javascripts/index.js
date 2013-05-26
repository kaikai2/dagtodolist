requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'javascripts/lib',
    
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
	app: '../app',
	view: '../view',
	model: '../model',
	async: 'require.async',
        template: '../../template',
        anim: '../anim',
        raphael: [
          //'//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min',
          'raphael',
      ],
      jquery: [
	 '//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min',
	 '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
	 'jquery',
      ],
      backbone: [
        '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
        'backbone',
      ],
      bootstrap: [
        '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.2.1/bootstrap.min',
        'bootstrap',
      ],
      underscore: [
        '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
        'underscore',
      ],
        
    },
    map:{
	"*": {
	    'smart': 'smart-2.9.min',
	},
    },
    shim: {
	underscore: {exports: '_'},
	backbone: {deps:["underscore", "jquery"], exports: "Backbone"},
        bootstrap: {deps: ["jquery"]},
    }
});
requirejs(['underscore', 'smart', 'raphael.amd', 'app/app'], function(_,s){
    console.log('undersocre loaded');
    console.log('smart loaded');
    console.log('raphael loaded');
    console.log('app loaded');
});
