/**
 * 程序入口文件，以及全局配置
 * **/
require.config({
    paths: {
        'jquery': 'vendor/jquery.min',
        'signals': 'vendor/router/signals.min',
        'crossroads': 'vendor/router/crossroads.min',
        'hasher': 'vendor/router/hasher.min',
		'routeService':'services/route/routeService',
        'utils':'utils',

    },
  
});
require([
    'jquery',
    'app'
],function($,app){
    $(function(){
        app.init();
    });

});
