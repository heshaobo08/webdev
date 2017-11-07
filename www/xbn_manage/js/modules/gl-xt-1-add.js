;
(function (X) {

	var gl_xt = X();
	
	var ctrl = gl_xt.ctrl();

	var path = X.configer.__ROOT_PATH__ + "/" + X.configer.__FILE_HTML__;

	var dataPath = X.configer.__API_PATH__+ "/" ;
	
	var request = gl_xt.utils.getRequest();

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
                    // 回调
                    callback && callback();
                },
				no:function(index){
					layer.close(index);
				}
            }
        });
    });
			
	ctrl.request({
		url: dataPath+ X.configer[request.m].api.adminList,
		type: "post",
		data : JSON.stringify({
			"isValid": true
		})
	}).then(function(data){
		if(data.statusCode == "2000000"){
			ctrl.render(data).then(function(){
				
				$(".js-submit").on("click",function(){
					$("#serviceForm").submit();
				});
				
				sele();
				
				$("#serviceForm").html5Validate(function(){
					var uname = $("input[name=uname]").val(),
						pwd = $("input[name=pwd]").val(),
						roleId = $("input[name=roleId]").attr("index-data"),
						remark = $("input[name=remark]").val();
					ctrl.request({
						url: dataPath+ X.configer[request.m].api.add,
						type: "post",
						data: JSON.stringify({
							"uname": uname,
							"pwd":pwd,
							"roleId":roleId,
							"remark":remark
						})
					}).then(function(data){
						if(data.statusCode=='2000000'){
							ctrl.tirgger('setTips','账户添加成功！',function(){
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
						};

						var verify;
						ctrl.request({
							url: dataPath+ X.configer[request.m].api.verify,
							type: "post",
							async : false,
							data: JSON.stringify({
								"uname": $('[name=uname]').val()
							})
						}).then(function(data){
							if(data.statusCode=='2000000'){
								verify = data.data;
							}else{
								ctrl.tirgger('setTips','数据操作失败');
							}
						});
						if(verify === false ){
							$("[name=uname]").testRemind("该账户已存在");
							return false;
						}

						return true;
					}
				});
			});
		}
	});
})(mXbn);