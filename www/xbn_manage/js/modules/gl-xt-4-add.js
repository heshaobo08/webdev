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
                    callback && callback();
                },
				no:function(index){
                    layer.close(index);
                }
            }
        })
    });
	
	function validates(){
		$("#serviceForm").html5Validate(function(){
			var levelName = $("input[name=levelName]").val();
			var isValid = $("input[type=radio]:checked").val();
			var remark = $("input[name=remark]").val();

			ctrl.request({
				url: dataPath+ X.configer[request.m].api.add,
				type: "POST",
				data: JSON.stringify({
					"levelName": levelName,
					"isValid": isValid,
					"remark": remark
				})
			}).then(function(data){
				if(data.statusCode=='2000000'){
					ctrl.tirgger('setTips','等级添加成功！',function(){
						gl_xt.router.setHistory("?m=xhr_id_1_300");
						gl_xt.router.runCallback();
					});
				}else{
					ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
				}
			});
		});
	}
	
	ctrl.render().then(function(){
		
		validates();
		// 提交
		$(".js-submit").on("click",function(){		
			$("#serviceForm").submit();
		});		
        // 角色唯一性验证
        $('[name=levelName]').off().on('blur',function () {
            var value=$(this).val(),
                that=$(this);
            ctrl.request({
                url: dataPath+ X.configer[request.m].api.verifyLevel,
                type: "POST",
                async:false,
                data: JSON.stringify({
                    "levelName": value
                })
            }).then(function (data) {
                if(data.statusCode=='2000000'){
                    if(!data.data){
                        that.testRemind("该等级名称已存在，请重新输入");
                        that.focus();
                        return;
                    }
                }else{
                    ctrl.tirgger('setTips',X.getErrorName(data.statusCode));
                }
            });
        });

	});
	
})(mXbn);