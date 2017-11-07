/**
 * 程序入口文件，以及全局配置
 * author yangweichao
 * **/
require.config({
    paths: {
        'jquery': 'vendor/jquery.min',
        'signals': 'vendor/router/signals.min',
        'crossroads': 'vendor/router/crossroads.min',
        'hasher': 'vendor/router/hasher.min',
        'core':'vendor/jqueryui/core',
        'datepicker':'vendor/jqueryui/datepicker',
		'routeService':'services/route/routeService',
		'timepicker':'vendor/jqueryui/timepicker',
		'jquery_ui':'vendor/jqueryui/jquery-ui.min',
        'utils':'utils',
		'pagenav':'vendor/pagenav/pagenav',
        'handlebars':'vendor/handlebars/handlebars.min',
        'views':'../views',
		'webuploader':'vendor/webupload/webuploader.min',
		'jqueryvalidate':'vendor/validate/jquery.validate.min',
		'additional_methods':'vendor/validate/additional-methods',
		'validate':'vendor/validate'

    },
    shim: {
		datepicker:{
			deps:['jquery_ui'],
			exports:"$.datepicker"
		},
		timepicker: {
            deps: ['jquery_ui','datepicker'],
            exports: "$.timepicker"
        }

    }
});

require([
    'jquery',
    'app'
],function($,app){
    $(function(){
        app.init();
    });

});
