;
(function (X) {
	
	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = X.configer.__API_PATH__; 

	var request = gl_xt.utils.getRequest();
	
	var id = request.id;
	
	var totalPages = "";//后台返回的总页码数
	
	var cPageNO = "";//当前页码

	ctrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer[request.m].tpl
	};
	
	renderData();
	//向后台发送数据
	function renderData(page){
		var page = page ? page : 1;
		ctrl.request({
			url: dataPath+ X.configer[request.m].api.queryList,
			type: "POST",
			data: JSON.stringify({
				"billName":request.b,
				"userID":request.u,
				"start":page,
				"pageSize":"50",
				"toPageNo": page
			})
		}).then(function(listData){
			var source = "";
			if(listData.statusCode == "2000000"){
				ctrl.request({
					url: dataPath+ X.configer[request.m].api.query + id,
					type: "POST"
				}).then(function(data){					
					if(data.statusCode == "2000000"){
						listData.source = data.data;
						ctrl.render(listData.source).then(function(){
							var list = listData.data.list;
							totalPages = listData.data.totalPages;
							cPageNO = page;
							
							//billTime();//调用账单周期(接口已提供字段billName账单周期 -- 不用前端自己模拟)
							ctrl.renderIn("#list",".smallTable tbody",{list : list});
							
							//分页组件
							Pager({
								topElem: "#topPager",
								elem: "#pager",
								defaultItem: cPageNO, //当前页码
								totalPages: totalPages //总页码
							}).then(function (p) {
								renderData(p);
							});
						});
					}
				});					
				
			}else{
				$(".bigTable tbody").html("<tr><td colspan='5' style='text-align:center'>操作失败</td></tr>");
			}
			
		});
	}
	
	function billTime(){
		//本期账单的账单周期
		var date = new Date(),
			y = date.getFullYear(),
			m = date.getMonth();
		var firstDay = new Date(y, m, 1);
		var lastDay = new Date(y, m + 1, 0);

		var dataString = firstDay.toLocaleDateString()+'--'+lastDay.toLocaleDateString()
		$(".billCycle").html(dataString.replace(/\//g,"."));
	}
	
})(mXbn);