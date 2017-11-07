;
(function (X) {
	
	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = X.configer.__API_PATH__; 

	var request = gl_xt.utils.getRequest();
	
	var name = unescape(request.name);

	ctrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer[request.m].tpl
	};
	
	renderData();
	
	//向后台发送数据
	function renderData(){
		ctrl.request({
			url: dataPath+ X.configer[request.m].api.serve,
			type: "POST",
			data: JSON.stringify({
				"productName": name
			})
		}).then(function(data){
			if(data.statusCode == "2000000"){
				ctrl.render(data.data);
			}else{
				$(".bigTable tbody").html("<tr><td colspan='5' style='text-align:center'>操作失败</td></tr>");
			}
			
		});
	}
	
})(mXbn);