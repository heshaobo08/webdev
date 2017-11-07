;
(function (X) {

	var gl_pz = X();

	var path = X.configer.__ROOT_PATH__ +'/'+ X.configer.__FILE_HTML__+'/';

	// var jsPath=X.configer.__ROOT_PATH__+'/' + X.configer.__FILE_JS__+'/';
	
	var jsPath=X.configer.__API_PATH__;

	var refundCtrl = gl_pz.ctrl();

	var localParm=gl_pz.utils.getRequest(),

		platform=localParm.platform,

		id=localParm.id,

		tpl=path + X.configer[localParm.m].tpl.ebay,

		cataList=null,

		siteList={};

	if(platform=='1'){
		// ebay
		tpl=path + X.configer[localParm.m].tpl.ebay;
		
	}else if(platform=='2'){
		// amazon'
		tpl=path + X.configer[localParm.m].tpl.amazon;

	}else if(platform=='3'){
		// newegg
		tpl=path + X.configer[localParm.m].tpl.newegg;
	}else{
		platform='1';
	}

	// 创建视图
	refundCtrl.view = {
		elem: "#id_conts",
		tpl:tpl
	};	

	// 获取站点列表所有数据
	refundCtrl.request({
		url:jsPath+X.configer["xhr_id_199_244"].api.siteList,
		data:JSON.stringify({
            'platformCode':platform
        }),
		type:'post'
	}).then(function(data){
		if(data.statusCode=='2000000'){			
			$.each(data.data,function(i,site){
				siteList[site.id]=site;
			})			
			// 获取退换货数据列表
			refundCtrl.tirgger('editRefund');
		}else{
			refundCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
		}
	});

	refundCtrl.on('editRefund',function(){
		if(id){
			// 编辑
			refundCtrl.request({
				type:'get',
				url:jsPath+X.configer[localParm.m].api.getRefundDetail+id
			}).then(function(data){
				if(data.statusCode=='2000000'){	
					data.data.site=siteList;
					// data.data.siteCode=siteList[data.data.siteId].siteCode;
					data.data.siteCode=getSiteDicWord(siteList[data.data.siteId]);
					refundCtrl.tirgger('getFullPath',data.data.categoryId,function(fullPath) {
						data.data.fullPath=fullPath;//设置分类路径
						if(platform=='1'){
							var returnType=[];
	                    	returnType.push("ADDITEM_RETURNPOLICY_ACCEPTED|"+data.data.siteCode,'ADDITEM_RETURNPOLICY_COSTPAID|'+data.data.siteCode,'ADDITEM_RETURNPOLICY_REFUNDDAYS|'+data.data.siteCode,'ADDITEM_RETURNPOLICY_REFUND|'+data.data.siteCode);
	                    	// 获取所有退货政策基础数据
			                refundCtrl.request({
			                    url:jsPath + X.configer[localParm.m].api.baseData,
			                    data:JSON.stringify({
			                        types:returnType
			                    }),
			                    type:'post'
			                }).then(function(basedata){
			                    if(basedata.statusCode=="2000000"){                     
			                        data.data.baseReturnData=basedata.data; 
			                        // 数据渲染 
									refundCtrl.render(data.data).then(function(){
										// dom节点event初始化
										refundCtrl.tirgger('dom_init',"#id_conts");
									});         
			                    }else{
			                        refundCtrl.tirgger('setTips',X.getErrorName(basedata.statusCode));
			                    }
			                });
						}else{
							// 数据渲染 
							refundCtrl.render(data.data).then(function(){
								// dom节点event初始化
								refundCtrl.tirgger('dom_init',"#id_conts");
							});
						}	
					});									
				}else{
					refundCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
				}
			});
		}
	});

	// 获取分类路径
	refundCtrl.on('getFullPath',function(categoryId,callback){		
		if(!categoryId){
			callback && callback();
			return;
		}
		refundCtrl.request({
			type:'get',
			url:jsPath+X.configer[localParm.m].api.getFullPaths+categoryId
		}).then(function (pathData) {
			if(pathData.statusCode=='2000000'){	
				callback && callback(pathData.data);
			}else{
				refundCtrl.tirgger('setTips',X.getErrorName(pathData.statusCode));
			}
		})
	});

	// dom节点event初始化
	refundCtrl.on('dom_init',function(ele){
		// 提交
		$('.js-rejectSaveSubmit',ele).off().on('click',function(){
			$("#rejectEditForm").submit();
		});
		// 提示框样式
        // $.testRemind.css = {
        //     "color": "#FFF",
        //     "borderColor": "#f60",
        //     "backgroundColor": "#f60",
        //     "border-radius": "5px"
        // };

		// 表单验证
		$("#rejectEditForm").html5Validate(function(){
			var oIsReturns=$('input[name=isReturns]','.siteDetail'),
		        oReturnType= $('input[name=returnType]','.siteDetail'),
		        oUndertaker=$('input[name=undertaker]','.siteDetail'),
		        oReturnDateNumber=$('input[name=returnDateNumber]','.siteDetail');
			var sendData={
		        "id": $('input[name=id]','.siteDetail').val(),
		        "platform": $('input[name=platform]','.siteDetail').val(),
		        "siteId":$('input[name=siteId]','.siteDetail').val(),
		        "isReturns": $('input[name=isReturns]','.siteDetail').attr('index-data'),
		        "returnType": $('input[name=returnType]','.siteDetail').attr('index-data'),
		        "undertaker":  $('input[name=undertaker]','.siteDetail').attr('index-data'),
		        "returnDateNumber": $('input[name=returnDateNumber]','.siteDetail').attr('index-data'),
		        "remark":$('[name=remark]','.siteDetail').val()
			};
			if(platform!='1'){
				sendData.isReturns=oIsReturns.val();
				sendData.returnType=oReturnType.val();
				sendData.undertaker=oUndertaker.val();
				sendData.returnDateNumber=oReturnDateNumber.val();
			}
			refundCtrl.request({
				data:JSON.stringify(sendData),
				url:jsPath+X.configer[localParm.m].api.saveRefund,
				type:'post'
			}).then(function(data){
				if(data.statusCode=='2000000'){	
					refundCtrl.tirgger('setTips','退货政策修改成功',function(){
						gl_pz.router.setHistory("?m=xhr_id_199_244&platform="+platform);
						gl_pz.router.runCallback();
					});
				}else{
					refundCtrl.tirgger('setTips',X.getErrorName(data.statusCode));
				}
			});
		});



		// 下拉列表
		sele();
		
	});

	 // 提示消息弹框方法定义
    refundCtrl.on('setTips',function(msg,callback){
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
