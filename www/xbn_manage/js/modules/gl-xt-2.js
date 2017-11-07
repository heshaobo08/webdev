;
(function (X) {
	
	var systemMain = X();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

	var systemMainCtrl = systemMain.ctrl();

	systemMainCtrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer["gl-xt-2"].tpl
	};
	
	systemMainCtrl.render();
	
})(mXbn);