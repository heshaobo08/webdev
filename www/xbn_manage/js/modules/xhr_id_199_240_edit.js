;
(function (X) {

	var gl_pz = X();

	var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

	// var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';

	var jsPath=X.configer.__API_PATH__;

	var setLogisticCtrl = gl_pz.ctrl();

	var localParm=gl_pz.utils.getRequest(),
		logisticsData=[];

	// 创建视图
	setLogisticCtrl.view = {
		elem: "#id_conts",
		tpl: path + "/" + X.configer[localParm.m].tpl
	};

	var getLogisticId=mXbn().utils.getRequest().id;
	// 物流基础信息加载页面
	if(getLogisticId){
		// 修改
		setLogisticCtrl.request({
	        url:jsPath + X.configer[localParm.m].api.viewInfo+getLogisticId,
	        type: "GET",
	    }).then(function(data){
	    	if(data.statusCode=='2000000'){
		    	// 物流公司基础数据
				setLogisticCtrl.tirgger('logisticOnload',function () {
					data.data.logisticsData=logisticsData;
					// 模板渲染
					setLogisticCtrl.render(data.data).then(function(){
			            // 触发页面dom事件
			            setLogisticCtrl.tirgger('dom_init',"#id_conts");
			        });
				});	            
	        }else{
	            setLogisticCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
	        }	        
	    });
	}else{
		setLogisticCtrl.request({
			url:jsPath + X.configer[localParm.m].api.baseData,
			data:JSON.stringify({
				types:['logistics_company']
			}),
			type:'post'
		}).then(function(data){
			if(data.statusCode=="2000000"){
				logisticsData=data.data['logistics_company'];
			
				// 新增
				setLogisticCtrl.render({logisticsData:logisticsData}).then(function(){
		            // 触发页面dom事件
		            setLogisticCtrl.tirgger('dom_init',"#id_conts");
		        });
		
			}else{
				setLogisticCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
			}
		});
		
		
	}

    
    

	// 初始化dom事件
	setLogisticCtrl.on('dom_init',function(ele){
		// 提交
		$('.js-logisSubmit',ele).on('click',function(){
			$('#logisticsForm').submit();
		});

		// 重置
		$('.js-logisReset',ele).on('click',function(){
			// Todo 重置
			$('#logisticsForm')[0].reset();
		});
		// 下拉列表
		sele();

		// 表单验证
		$("#logisticsForm").html5Validate(function(){
			var url='',
				sendData=null;
			// 修改
			if(getLogisticId){
				url=jsPath + X.configer[localParm.m].api.logisticsUpdate;
			}else{
				url=jsPath + X.configer[localParm.m].api.logisticsCreate; // 新增 
			}
			// sendData=mXbn().utils.getRequest(encodeURI($('#logisticsForm').serialize()));
			sendData={
			  "id":  $("input[name=id]","#logisticsForm").val(),
			  "name": $("input[name=name]","#logisticsForm").val(),
			  "companyName": $("input[name=companyName]","#logisticsForm").attr('index-data'),
			  "code": $("input[name=code]","#logisticsForm").val(),
			  "product": $("input[name=product]","#logisticsForm").val(),
			  "url": $("input[name=url]","#logisticsForm").val(),
			  "remark": $("[name=remark]","#logisticsForm").val()
			};
			// 提交修改/添加
			setLogisticCtrl.request({
				url:url,
				data:JSON.stringify(sendData),
				type:'post'
			}).then(function(data){
				if(data.statusCode=="2000000"){
					setLogisticCtrl.tirgger('setTips',getLogisticId?'物流修改成功':'物流添加成功',function(){
						gl_pz.router.setHistory("?m=xhr_id_199_240");
						gl_pz.router.runCallback();
					});
					
				}else{
					setLogisticCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
				}
			});
		});

	});
	
	// 基础物流数据
	setLogisticCtrl.on('logisticOnload',function(callback){
		setLogisticCtrl.request({
			url:jsPath + X.configer[localParm.m].api.baseData,
			data:JSON.stringify({
				types:['logistics_company']
			}),
			type:'post'
		}).then(function(data){
			if(data.statusCode=="2000000"){
				logisticsData=data.data['logistics_company'];
				callback && callback();				
			}else{
				setLogisticCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
			}
		});
	});
	
	 // 提示消息弹框方法定义
    setLogisticCtrl.on('setTips',function(msg,callback){
    	if(!msg) return;
        $.layer({
            title:'提示消息',
            area: ['500px', '200px'],
            dialog:{
                btns:1,
                btn:['返回'],
                type:8,
                msg:'<div class="tips mB20"><em>'+msg+'</em></div>',
                yes:function(index){
                    layer.close(index);
                    // 回调
                    callback && callback();
                }
            }
        })
    });


})(mXbn);
