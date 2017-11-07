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
                msg:'<div class="tips"><em>'+msg+'</em></div>',
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
			var remark = $("input[name=remark]").val();
			var isValid = $("input[type=radio]:checked").val();
			
			//编辑等级信息
			ctrl.request({
				url: dataPath+ X.configer[request.m].api.edit,
				type: "POST",
				data:JSON.stringify({
					"id":id, //会员等级Id
					"levelName": levelName,
					"isValid": isValid,
					"remark": remark
				})
			}).then(function(data){
				if(data.statusCode=='2000000'){
					ctrl.tirgger('setTips','等级编辑成功！',function(){
						gl_xt.router.setHistory("?m=xhr_id_1_300");
						gl_xt.router.runCallback();
					});
				}else{
					ctrl.tirgger('setTips','数据操作失败');
				}
			});
		});
	}
	
	//查询等级信息
	ctrl.request({
		url: dataPath+ X.configer[request.m].api.query + id,
		type: "GET"
	}).then(function(data){
		ctrl.render(data.data).then(function(){
			
			validates();
			
			$(".js-submit").on("click",function(){		
				$("#serviceForm").submit();
			});		
			
			// 角色唯一性验证
	        $('[name=levelName]').off().on('blur',function () {
	            var value=$(this).val(),
	                that=$(this);
	            if(value!=$(this).attr('data-oldVal')){
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
	            }
	            
	        });
		});
	});

})(mXbn);