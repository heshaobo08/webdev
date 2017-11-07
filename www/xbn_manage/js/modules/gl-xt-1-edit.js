;
(function (X) {

	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;
	
	var dataPath = X.configer.__API_PATH__+ "/" ;
	
	var request = gl_xt.utils.getRequest();
	
	var id = request.id;
	
	ctrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer[request.m].tpl
	};	
	
	// 提示消息弹框方法定义
    ctrl.on('setTips',function(msg,callback){
    	if(!msg) return;
        $.layer({
            title:'提示消息',
            area: ['500px', ''],
            dialog:{
                btns : 2,
				btn : ['确定', '取消'],
				type : 8,
                msg:'<div class="tips">'+msg+'</div>',
                yes:function(index){
					layer.close(index);
                    callback && callback();
                },
				no:function(index){
                    layer.close(index);
                }
            }
        })
    });
	
	ctrl.request({
		url: dataPath+ X.configer[request.m].api.query + id,
		type: "GET"
	}).then(function(data){
		if(data.statusCode == "2000000"){
			//加载账户权限配置
			ctrl.request({
				url: dataPath+ X.configer[request.m].api.power,
				type: "post",
				data:'{}'
			}).then(function(levelData){
				if(levelData.statusCode == "2000000"){
					data.data.levelData=levelData.data;
					// 模板渲染
					ctrl.render(data.data).then(function(){				
						validates();						
						$(".js-submit").on("click",function(){		
							$("#serviceForm").submit();
						});						
						sele();
					});
				}else{
					ctrl.tirgger('setTips',X.getErrorName(levelData.statusCode));
				}
				
			});
		}else{
			ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
		}
	});
	
	
	function validates(){
		$("#serviceForm").html5Validate(function(){
			var uname = $("input[name=uname]").val(),
				pwd = $("input[name=pwd]").val(),
				roleId = $("input[name=roleId]").attr("index-data"),
				remark = $("input[name=remark]").val();
			ctrl.request({
				url: dataPath+ X.configer[request.m].api.edit,
				type: "post",
				data: JSON.stringify({
					"id":id,
					"uname": uname,
					"pwd":pwd,
					"roleId":roleId,
					"remark":remark
				})
			}).then(function(data){
				if(data.statusCode=='2000000'){
					ctrl.tirgger('setTips','账户编辑成功！',function(){
						gl_xt.router.setHistory("?m=xhr_id_1_9");
						gl_xt.router.runCallback();
					});
				}else{
					ctrl.tirgger('setTips','数据操作失败');
				}
			});
		},{
			validate: function() {
				if($('input[name=pwd]',"#serviceForm").val()!==$('input[name=repwd]',"#serviceForm").val()){
					$('input[name=repwd]',"#serviceForm").testRemind("请于账户密码内容完全保持一致");
					return false;
				}
				return true;
			}
		});
	}
	
})(mXbn);